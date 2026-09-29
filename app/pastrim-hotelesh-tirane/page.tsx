import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("hotele");

export default function Page() {
  return <ServicePage slug="hotele" />;
}
