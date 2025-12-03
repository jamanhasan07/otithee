"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Truck,
  Home,
  Grid,
  BookOpen,
  FileText,
  Layers,
  Plane,
} from "lucide-react";

type ModuleItem = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path?: string; // where to navigate on click
  tag?: string;
};

const MODULES: ModuleItem[] = [
  {
    id: "hotel",
    title: "Hotel & Resort Management",
    description:
      "Front desk, rooms, housekeeping, maintenance, F&B, folios & reports.",
    icon: <Home className="w-6 h-6" />,
    path: "/dashboard/hotel",
    tag: "Core",
  },
  {
    id: "transport",
    title: "Ride Sharing & Transportation",
    description:
      "Vehicle booking, drivers, fleet tracking and billing automation.",
    icon: <Truck className="w-6 h-6" />,
    path: "/dashboard/transport",
    tag: "Logistics",
  },
  {
    id: "aviation",
    title: "Aviation & Overseas Services",
    description: "Air ticketing, visas, manpower & compliance workflows.",
    icon: <Plane className="w-6 h-6" />,
    path: "/dashboard/aviation",
    tag: "Travel",
  },
  {
    id: "property",
    title: "Property Management (PMS)",
    description:
      "Tenant portals, rent collection, maintenance & utilities billing.",
    icon: <Layers className="w-6 h-6" />,
    path: "/dashboard/property",
    tag: "Real Estate",
  },
  {
    id: "city",
    title: "City & Resort Management",
    description:
      "Facility booking, access control, community services & IoT integration.",
    icon: <Grid className="w-6 h-6" />,
    path: "/dashboard/city",
    tag: "Urban",
  },
  {
    id: "training",
    title: "Training Management (LMS/TMS)",
    description:
      "Course management, exams, certifications, student & instructor flows.",
    icon: <BookOpen className="w-6 h-6" />,
    path: "/dashboard/training",
    tag: "Training",
  },
  {
    id: "accounting_hr",
    title: "Accounting & HR",
    description:
      "Full ERP finance: GL, invoices, payroll, attendance & recruitment.",
    icon: <FileText className="w-6 h-6" />,
    path: "/dashboard/accounting-hr",
    tag: "Finance",
  },
  {
    id: "core",
    title: "Core ERP Modules",
    description:
      "Unified dashboard, roles & permissions, notifications, API integrations.",
    icon: <CalendarDays className="w-6 h-6" />,
    path: "/dashboard/core",
    tag: "Platform",
  },
];

export default function ModulesGrid() {
  const router = useRouter();

  return (
    <div className="px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Otithee ERP — Modules</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 ">
        {MODULES.map((m) => (
          <Card
            key={m.id}
            onClick={() => m.path && router.push(m.path)}
            className="cursor-pointer hover:shadow-xl transition-shadow duration-150 relative overflow-hidden"
          >
            <CardHeader className="flex items-start justify-between gap-4  mt-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-muted p-2">{m.icon}</div>
                <CardTitle className="text-base">{m.title}</CardTitle>
              </div>
            </CardHeader>

            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                {m.description}
              </CardDescription>
            </CardContent>
            <div className="absolute left-0 -top-[1px] border-r border rounded-r-lg  bg-muted">
              {m.tag && <Badge variant="secondary">{m.tag}</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
