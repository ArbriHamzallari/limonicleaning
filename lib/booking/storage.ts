// Private media storage. Never public, never permanent links.
//  - "s3": any S3-compatible bucket (Cloudflare R2, AWS S3…). The browser uploads straight to
//    the bucket with a 15-minute presigned PUT; viewing uses 5-minute presigned GETs, only
//    handed out to the logged-in owner or to the request's own customer link.
//  - "local": files in .data/uploads (git-ignored). Development and tests only; refused in
//    production because Vercel's disk is temporary.
// Not configured → uploads are off and the form says so (customers can still use WhatsApp).
import { mkdir, open, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

export interface StoredInfo {
  size: number;
}

export interface MediaStorage {
  driver: "s3" | "local";
  /** Where the browser PUTs the file. */
  uploadTarget(key: string, contentType: string, size: number, localUrl: string): Promise<{ url: string; headers: Record<string, string> }>;
  info(key: string): Promise<StoredInfo | null>;
  head(key: string, bytes: number): Promise<Uint8Array>;
  remove(key: string): Promise<void>;
  /** Short-lived URL to view (s3) or null when the caller must stream it (local). */
  viewUrl(key: string, contentType: string): Promise<string | null>;
  /** Local driver only. */
  read?(key: string): Promise<Buffer>;
  write?(key: string, data: Buffer): Promise<void>;
}

function localStorage(): MediaStorage {
  // turbopackIgnore: runtime-only paths; without it the build traces the whole project into the
  // server bundle. The local driver never runs in production anyway.
  const dir = process.env.MEDIA_LOCAL_DIR ?? join(/* turbopackIgnore: true */ process.cwd(), ".data", "uploads");
  const path = (key: string) => join(/* turbopackIgnore: true */ dir, key.replace(/[^A-Za-z0-9._-]/g, "_"));
  return {
    driver: "local",
    async uploadTarget(_key, _type, _size, localUrl) {
      return { url: localUrl, headers: {} };
    },
    async info(key) {
      try {
        return { size: (await stat(path(key))).size };
      } catch {
        return null;
      }
    },
    async head(key, bytes) {
      const fh = await open(path(key), "r");
      try {
        const buf = Buffer.alloc(bytes);
        const { bytesRead } = await fh.read(buf, 0, bytes, 0);
        return buf.subarray(0, bytesRead);
      } finally {
        await fh.close();
      }
    },
    async remove(key) {
      await rm(path(key), { force: true });
    },
    async viewUrl() {
      return null;
    },
    async read(key) {
      return readFile(path(key));
    },
    async write(key, data) {
      await mkdir(dir, { recursive: true });
      await writeFile(path(key), data, { mode: 0o600 });
    },
  };
}

async function s3Storage(): Promise<MediaStorage> {
  const { S3Client, HeadObjectCommand, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
  const client = new S3Client({
    region: process.env.S3_REGION ?? "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID!, secretAccessKey: process.env.S3_SECRET_ACCESS_KEY! },
    forcePathStyle: !!process.env.S3_ENDPOINT,
  });
  const Bucket = process.env.S3_BUCKET!;
  return {
    driver: "s3",
    async uploadTarget(key, contentType, size) {
      const url = await getSignedUrl(client, new PutObjectCommand({ Bucket, Key: key, ContentType: contentType, ContentLength: size }), {
        expiresIn: 15 * 60,
      });
      return { url, headers: { "Content-Type": contentType } };
    },
    async info(key) {
      try {
        const h = await client.send(new HeadObjectCommand({ Bucket, Key: key }));
        return { size: Number(h.ContentLength ?? 0) };
      } catch {
        return null;
      }
    },
    async head(key, bytes) {
      const r = await client.send(new GetObjectCommand({ Bucket, Key: key, Range: `bytes=0-${bytes - 1}` }));
      return new Uint8Array(await r.Body!.transformToByteArray());
    },
    async remove(key) {
      await client.send(new DeleteObjectCommand({ Bucket, Key: key }));
    },
    async viewUrl(key, contentType) {
      return getSignedUrl(client, new GetObjectCommand({ Bucket, Key: key, ResponseContentType: contentType, ResponseCacheControl: "private, no-store" }), {
        expiresIn: 5 * 60,
      });
    },
  };
}

export function storageDriver(): "s3" | "local" | null {
  const d = process.env.MEDIA_STORAGE;
  if (d === "s3" && process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY) return "s3";
  if (d === "local" && process.env.NODE_ENV !== "production") return "local";
  return null;
}

let instance: Promise<MediaStorage> | null = null;
export function getStorage(): Promise<MediaStorage> | null {
  const d = storageDriver();
  if (!d) return null;
  instance ??= d === "s3" ? s3Storage() : Promise.resolve(localStorage());
  return instance;
}
