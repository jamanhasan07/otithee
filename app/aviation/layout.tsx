
import { AVIATION_MODULES, HOTEL_MODULES } from "@/lib/modules";
import DashboardLayoutWrapper from "../dashboard/components/DashboardLayoutWrapper";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayoutWrapper modules={AVIATION_MODULES}>
      {children}
    </DashboardLayoutWrapper>
  );
}
