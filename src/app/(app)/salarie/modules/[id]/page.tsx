"use client";

import { use } from "react";
import { ModuleContent } from "@/components/modules/module-content";

export default function SalarieModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ModuleContent moduleId={id} basePath="/salarie" />;
}
