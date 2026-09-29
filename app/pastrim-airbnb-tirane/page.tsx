import { ServicePage } from "@/components/ServicePage";
import { serviceMetadata } from "@/lib/services";

export const metadata = serviceMetadata("airbnb");

export default function Page() {
  return <ServicePage slug="airbnb" />;
}
