-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('E_RE', 'KONTAKTUAR', 'OFERTE_DERGUAR', 'FITUAR', 'HUMBUR');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('WHATSAPP', 'TELEFON');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "area" TEXT,
    "message" TEXT,
    "channel" "ContactChannel" NOT NULL DEFAULT 'WHATSAPP',
    "pagePath" TEXT NOT NULL,
    "utmSource" TEXT,
    "utmCampaign" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'E_RE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "leads_createdAt_idx" ON "leads"("createdAt");

