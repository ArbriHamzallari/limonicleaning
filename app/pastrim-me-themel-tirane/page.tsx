import { ResidentialDeepCleaningLanding } from "@/components/ResidentialDeepCleaningLanding";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("me-themel");

export default function Page() {
  return <ResidentialDeepCleaningLanding />;
}
