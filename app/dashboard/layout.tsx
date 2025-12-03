// app/dashboard/layout.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_MODULES } from "@/lib/modules";
import AppSidebar from "./components/AppSidebar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isHotelRoute = pathname.startsWith("/dashboard/hotel");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Only show global AppSidebar when NOT on hotel routes */}
      {!isHotelRoute && (
        <aside className="w-72 flex-shrink-0 h-screen overflow-y-auto border-r bg-white">
          <AppSidebar modules={DEFAULT_MODULES} />
        </aside>
      )}

      <main className="flex-1 min-h-screen overflow-auto">
        {children}
      </main>
    </div>
  );
}
