import { ModulesProvider } from "@/context/modules-context";
import { TRANSPORT_MODULES } from "@/lib/modules";

export default function TransportLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModulesProvider modules={TRANSPORT_MODULES}>
      {children}
    </ModulesProvider>
  );
}
