import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("me-themel");

export default function Page() {
  return <ServicePage slug="me-themel" />;
}
