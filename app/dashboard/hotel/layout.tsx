// app/dashboard/hotel/layout.tsx
"use client";

import React from "react";
import { HOTEL_MODULES } from "@/lib/modules";
import HotelSidebar from "../components/HotelSidebar";
import Header from "./components/Header";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* FIXED SIDEBAR */}
      <aside
        className="w-72 h-screen overflow-y-auto border-r bg-white fixed left-0 top-0 z-40"
        aria-label="Hotel navigation"
      >
        <HotelSidebar modules={HOTEL_MODULES} />
      </aside>

      {/* TOPBAR (shadcn/ui for profile dropdown) */}
      <Header></Header>

      <main
        className="
          ml-72        /* space for sidebar */
          pt-16        /* space for topbar */
          p-6
          min-h-screen
          mt-6
        "
      >
        {children}
      </main>
    </div>
  );
}
