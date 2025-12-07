"use client";

import { useModules } from "@/context/modules-context";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const modules = useModules();

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 h-full overflow-y-auto border-r bg-white shrink-0">
        <AppSidebar modules={modules} />
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
