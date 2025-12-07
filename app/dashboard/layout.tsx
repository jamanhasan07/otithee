
import { ModulesProvider } from "@/context/modules-context";
import { DEFAULT_MODULES } from "@/lib/modules";
import DashboardShell from "./components/DashboardShell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ModulesProvider modules={DEFAULT_MODULES}>
      <DashboardShell>{children}</DashboardShell>
    </ModulesProvider>
  );
}
