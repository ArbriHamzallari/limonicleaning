"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { isServiceSlug } from "@/lib/service-index";

export function LeadFormFromQuery() {
  const param = useSearchParams().get("sherbimi");
  const service = isServiceSlug(param) ? param : undefined;
  return <LeadForm key={service ?? "none"} service={service} placement="kerko_oferte" />;
}
