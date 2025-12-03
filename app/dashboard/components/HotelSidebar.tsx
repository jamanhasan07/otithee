// components/HotelSidebar.tsx
"use client";

import React from "react";
import AppSidebar from "./AppSidebar";
import type { ModuleGroup } from "@/lib/modules";

export default function HotelSidebar({ modules }: { modules?: ModuleGroup[] }) {
  return <AppSidebar modules={modules} />;
}
