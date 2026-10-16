"use client";

import { useSearchParams } from "next/navigation";
import { LeadForm } from "@/components/LeadForm";
import { isPageKey } from "@/lib/service-index";

export function LeadFormFromQuery() {
  const param = useSearchParams().get("sherbimi");
  const page = isPageKey(param) ? param : undefined;
  return <LeadForm key={page ?? "none"} page={page} placement="kerko_oferte" />;
}
