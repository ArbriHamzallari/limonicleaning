import { ServicePageView } from "@/components/ServicePage";
import { businessPage, contentMetadata } from "@/lib/services";

export const metadata = contentMetadata(businessPage);

export default function Page() {
  return <ServicePageView page={businessPage} />;
}
