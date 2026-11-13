-- Booking section (Nov 2026): optional customer email and a preferred time of day.
-- Additive and nullable; existing rows are unchanged.
ALTER TABLE "service_requests" ADD COLUMN "email" TEXT;
ALTER TABLE "service_requests" ADD COLUMN "preferredTime" TEXT;
