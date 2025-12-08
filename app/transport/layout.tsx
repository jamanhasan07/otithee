import React from "react";
import DashboardLayoutWrapper from "../dashboard/components/DashboardLayoutWrapper";
import { TRANSPORT_MODULES } from "@/lib/modules";

const TransportLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardLayoutWrapper modules={TRANSPORT_MODULES}>
        {children}
      </DashboardLayoutWrapper>
    </div>
  );
};

export default TransportLayout;
