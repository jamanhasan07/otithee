"use client";

import React from "react";
import { usePathname } from "next/navigation";

import { DEFAULT_MODULES } from "@/lib/modules";
import AppSidebar from "./components/AppSidebar";
import Profile from "./components/Profile";
import Header from "./components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isHotelRoute = pathname.startsWith("/dashboard/hotel");
  const isTransport = pathname.startsWith("/dashboard/transport");

  return (
    <div className="min-h-screen flex bg-background">
      {/* Only show global AppSidebar when NOT on hotel routes */}
      {!isHotelRoute && !isTransport && (
        <aside className="w-72 flex-shrink-0 h-screen overflow-y-auto border-r bg-white">
          <AppSidebar modules={DEFAULT_MODULES} />
        </aside>
      )}

      <Header></Header>

      <main className="flex-1 min-h-screen overflow-auto ">{children}</main>
    </div>
  );
}
