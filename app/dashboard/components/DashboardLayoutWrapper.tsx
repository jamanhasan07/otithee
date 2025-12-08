"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_MODULES, ModuleGroup } from "@/lib/modules";
import AppSidebar from "./AppSidebar";
import Header from "./Header";

type DashboardLayoutWrapperProps = {
  children: React.ReactNode;
  modules?: ModuleGroup[];
};

const DashboardLayoutWrapper: React.FC<DashboardLayoutWrapperProps> = ({
  children,
  modules = DEFAULT_MODULES,
}) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  return (
    <div className="h-screen bg-slate-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* MOBILE SIDEBAR (drawer) */}
      <motion.aside
        initial={false}
        animate={{ x: isMobileSidebarOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="
          fixed inset-y-0 left-0 z-30
          w-72 bg-white border-r shadow-sm
          overflow-y-auto
          md:hidden
        "
      >
        <AppSidebar modules={modules} />
      </motion.aside>

      {/* DESKTOP SIDEBAR (always visible) */}
      <aside
        className="
          hidden md:block
          fixed inset-y-0 left-0 z-20
          w-72 bg-white border-r shadow-sm
          overflow-y-auto
        "
      >
        <AppSidebar modules={modules} />
      </aside>

      {/* CONTENT AREA */}
      <div className="h-full flex flex-col md:ml-72 transition-[margin] duration-300">
        <Header
          onToggleSidebar={toggleMobileSidebar}
          // you can pass this if you want to change the icon
          isSidebarOpen={isMobileSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayoutWrapper;
