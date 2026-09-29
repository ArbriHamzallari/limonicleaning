-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTAMENT', 'AIRBNB', 'VILE', 'ZYRE', 'BIZNES', 'TJETER');

-- CreateEnum
CREATE TYPE "CleaningType" AS ENUM ('STANDARD', 'THEMEL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('E_RE', 'KONFIRMUAR', 'ANULUAR', 'PERFUNDUAR');

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "typology" TEXT NOT NULL,
    "cleaningType" "CleaningType" NOT NULL,
    "date" DATE NOT NULL,
    "time" TEXT NOT NULL,
    "extras" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimatedPriceAll" INTEGER,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'E_RE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_reference_key" ON "bookings"("reference");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "contact_messages_createdAt_idx" ON "contact_messages"("createdAt");
