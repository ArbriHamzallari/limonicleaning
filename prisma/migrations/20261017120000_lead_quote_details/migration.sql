-- AlterTable: optional quote details from the redesigned form. Nullable, so existing rows stay valid.
ALTER TABLE "leads" ADD COLUMN "propertyType" TEXT,
ADD COLUMN "sizeM2" INTEGER,
ADD COLUMN "frequency" TEXT,
ADD COLUMN "timing" TEXT,
ADD COLUMN "businessName" TEXT;
