import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("apartamente");

export default function Page() {
  return <ServicePage slug="apartamente" />;
}
