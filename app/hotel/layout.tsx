import React, { ReactNode } from "react";

import { HOTEL_MODULES } from "@/lib/modules";
import DashboardLayoutWrapper from "../dashboard/components/DashboardLayoutWrapper";


const HotelLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <DashboardLayoutWrapper modules={HOTEL_MODULES}>{children}</DashboardLayoutWrapper>
    </div>
  );
};

export default HotelLayout;
