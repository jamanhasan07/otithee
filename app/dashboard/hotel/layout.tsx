import { ModulesProvider } from "@/context/modules-context";
import { HOTEL_MODULES } from "@/lib/modules";

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModulesProvider modules={HOTEL_MODULES}>
      {children}
    </ModulesProvider>
  );
}
