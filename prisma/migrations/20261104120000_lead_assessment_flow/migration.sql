-- Nov 2026 assessment flow: optional quote details, duplicate protection, owner-alert results,
-- manual pipeline stages. Additive only: every new column is nullable or has a default, so
-- existing rows stay valid and the code currently in production keeps working.
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'VLERESIM';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'PERFUNDUAR';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'PAGUAR';
ALTER TYPE "LeadStatus" ADD VALUE IF NOT EXISTS 'NE_PRITJE';

ALTER TABLE "leads"
  ADD COLUMN "sizeUnknown" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "condition" TEXT,
  ADD COLUMN "preferredDate" TEXT,
  ADD COLUMN "assessmentMethod" TEXT,
  ADD COLUMN "priorities" TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN "estimateLek" INTEGER,
  ADD COLUMN "clientRequestId" TEXT,
  ADD COLUMN "emailSentAt" TIMESTAMP(3),
  ADD COLUMN "whatsappSentAt" TIMESTAMP(3),
  ADD COLUMN "notifyStatus" TEXT,
  ADD COLUMN "quotedTotalLek" INTEGER,
  ADD COLUMN "statusNote" TEXT;

CREATE UNIQUE INDEX "leads_clientRequestId_key" ON "leads"("clientRequestId");
