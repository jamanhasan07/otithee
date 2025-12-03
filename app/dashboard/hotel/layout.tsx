// app/dashboard/hotel/layout.tsx
import React from "react";

import { HOTEL_MODULES } from "@/lib/modules";
import HotelSidebar from "../components/HotelSidebar";

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-72 flex-shrink-0 h-screen overflow-y-auto border-r bg-white">
        <HotelSidebar modules={HOTEL_MODULES} />
      </aside>

      <main className="flex-1 min-h-screen overflow-auto p-6">
     

        {children}
      </main>
    </div>
  );
}
