-- Booking requests (Nov 2026). New tables only; existing tables are not changed.
-- btree_gist lets one exclusion constraint compare crew numbers (=) and time ranges (&&).
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING_REVIEW', 'AWAITING_INFO', 'AWAITING_CUSTOMER', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "DateMode" AS ENUM ('NONE', 'PREFERRED', 'HELD');

-- CreateEnum
CREATE TYPE "CalendarSync" AS ENUM ('NOT_NEEDED', 'PENDING', 'SYNCED', 'FAILED', 'DRIFT');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('PROPOSED', 'ACCEPTED', 'SUPERSEDED', 'REJECTED');

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "publicTokenHash" TEXT NOT NULL,
    "publicTokenEnc" TEXT NOT NULL,
    "clientRequestId" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "service" TEXT NOT NULL,
    "catalogVersion" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "priorities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "note" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL DEFAULT 'WHATSAPP',
    "area" TEXT,
    "outsideTirana" BOOLEAN NOT NULL DEFAULT false,
    "dateMode" "DateMode" NOT NULL DEFAULT 'NONE',
    "preferredDate" TEXT,
    "dateNote" TEXT,
    "feasibilityOk" BOOLEAN NOT NULL DEFAULT false,
    "plannedCrews" INTEGER,
    "plannedMinutes" INTEGER,
    "address" TEXT,
    "jobSheetTokenHash" TEXT,
    "jobSheetTokenEnc" TEXT,
    "pagePath" TEXT NOT NULL DEFAULT '/kerko-oferte',
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "emailSentAt" TIMESTAMP(3),
    "whatsappSentAt" TIMESTAMP(3),
    "notifyStatus" TEXT,
    "calendarEventId" TEXT,
    "calendarSync" "CalendarSync" NOT NULL DEFAULT 'NOT_NEEDED',
    "calendarSyncError" TEXT,
    "calendarSyncedAt" TIMESTAMP(3),
    "calendarAttempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshot" JSONB NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'PROPOSED',
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_media" (
    "id" TEXT NOT NULL,
    "requestId" TEXT,
    "draftKeyHash" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "kind" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uploading',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "request_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_reservations" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "crew" INTEGER,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "jobEndsAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'held',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releasedAt" TIMESTAMP(3),

    CONSTRAINT "slot_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "request_events" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "detail" JSONB,

    CONSTRAINT "request_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_publicTokenHash_key" ON "service_requests"("publicTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_clientRequestId_key" ON "service_requests"("clientRequestId");

-- CreateIndex
CREATE UNIQUE INDEX "service_requests_jobSheetTokenHash_key" ON "service_requests"("jobSheetTokenHash");

-- CreateIndex
CREATE INDEX "service_requests_status_createdAt_idx" ON "service_requests"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_requestId_version_key" ON "proposals"("requestId", "version");

-- CreateIndex
CREATE UNIQUE INDEX "request_media_storageKey_key" ON "request_media"("storageKey");

-- CreateIndex
CREATE INDEX "request_media_draftKeyHash_idx" ON "request_media"("draftKeyHash");

-- CreateIndex
CREATE INDEX "request_media_requestId_idx" ON "request_media"("requestId");

-- CreateIndex
CREATE INDEX "slot_reservations_requestId_idx" ON "slot_reservations"("requestId");

-- CreateIndex
CREATE INDEX "slot_reservations_startsAt_idx" ON "slot_reservations"("startsAt");

-- CreateIndex
CREATE INDEX "request_events_requestId_at_idx" ON "request_events"("requestId", "at");

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_media" ADD CONSTRAINT "request_media_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_reservations" ADD CONSTRAINT "slot_reservations_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "request_events" ADD CONSTRAINT "request_events_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- No crew can hold two overlapping active reservations. This is what stops two website
-- requests from taking the same capacity at the same moment (checked by Postgres itself).
ALTER TABLE "slot_reservations" ADD CONSTRAINT "slot_reservations_no_overlap"
  EXCLUDE USING gist ("crew" WITH =, tsrange("startsAt", "endsAt", '[)') WITH &&)
  WHERE ("status" <> 'released');
