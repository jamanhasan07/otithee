import React from "react";

import { DEFAULT_MODULES } from "@/lib/modules";
import DashboardLayoutWrapper from "./components/DashboardLayoutWrapper";

const DashbaordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardLayoutWrapper modules={DEFAULT_MODULES}>
        {children}
      </DashboardLayoutWrapper>
    </div>
  );
};

export default DashbaordLayout;
