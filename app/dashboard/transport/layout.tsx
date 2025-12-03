
import React from "react";

import {  TRANSPORT_MODULES } from "@/lib/modules";
import AppSidebar from "../components/AppSidebar";

export default function TransportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <aside className="w-72 flex-shrink-0 h-screen overflow-y-auto border-r bg-white">
        <AppSidebar modules={TRANSPORT_MODULES}></AppSidebar>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto p-6">{children}</main>
    </div>
  );
}
