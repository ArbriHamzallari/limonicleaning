import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoBuffer = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#FEFBEA",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoSrc} width={54} height={73} alt="" />
          <div style={{ fontSize: 40, fontWeight: 800, color: "#16241C" }}>Limoni Cleaning</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 800, color: "#16241C" }}>
          Pastërti që ndihet.
        </div>
        <div style={{ marginTop: 20, fontSize: 32, color: "#5B6B60" }}>
          Pastrim profesional për Airbnb, apartamente, vila dhe zyra në Tiranë.
        </div>
      </div>
    ),
    { ...size },
  );
}
