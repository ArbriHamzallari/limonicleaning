import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("pas-ndertimit");

export default function Page() {
  return <ServicePage slug="pas-ndertimit" />;
}
