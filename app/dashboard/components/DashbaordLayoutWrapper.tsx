"use client";

import { DEFAULT_MODULES } from "@/lib/modules";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

type DashbaordLayoutWrapperProps = {
  children: React.ReactNode;
  modules?: any[];
};

const DashbaordLayout: React.FC<DashbaordLayoutWrapperProps> = ({
  modules = DEFAULT_MODULES,
  children,
}) => {
  return (
    // Whole viewport, no window scroll
    <div className="h-screen bg-slate-50 overflow-hidden">
      {/* SIDEBAR (fixed, its own vertical scroll) */}
      <aside
        className="w-72 h-screen overflow-y-auto border-r bg-white fixed left-0 top-0 z-40"
      >
        <AppSidebar modules={modules} />
      </aside>

      {/* CONTENT AREA shifted by sidebar width */}
      <div className="h-full ml-72 flex flex-col">
        {/* HEADER (no scroll here) */}
        <Header />

        {/* MAIN CONTENT (only this scrolls besides sidebar) */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-10 bg-green-600">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashbaordLayout;
