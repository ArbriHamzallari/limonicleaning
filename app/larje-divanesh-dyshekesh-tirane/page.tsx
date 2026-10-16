import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("divane");

export default function Page() {
  return <ServicePage slug="divane" />;
}
