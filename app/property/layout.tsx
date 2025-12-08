import React from "react";
import DashboardLayoutWrapper from "../dashboard/components/DashboardLayoutWrapper";
import { PROPERTY_MODULES } from "@/lib/modules";

const PropertyLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardLayoutWrapper modules={PROPERTY_MODULES}>
        {children}
      </DashboardLayoutWrapper>
    </div>
  );
};

export default PropertyLayout;
