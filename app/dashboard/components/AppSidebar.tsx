"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Layers,
  Truck,
  Plane,
  FileText,
  Building2,
  Map,
  GraduationCap,
  UserCog,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { title: string; href?: string; badge?: string | number };
type ModuleGroup = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: NavItem[];
};

export const DEFAULT_MODULES: ModuleGroup[] = [
  // Dashboard
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard" },
      { title: "Reports", href: "/dashboard/reports" },
    ],
  },

  // Hotel
  {
    id: "hotel",
    title: "Hotel",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Rooms", href: "/hotel/rooms" },
      { title: "Housekeeping", href: "/hotel/housekeeping" },
      { title: "Maintenance", href: "/hotel/maintenance" },
      { title: "Reservations", href: "/hotel/reservations" },
      { title: "Front Desk", href: "/hotel/frontdesk" },
      { title: "Guests", href: "/hotel/guests" },
    ],
  },

  // Transport
  {
    id: "transport",
    title: "Transport",
    icon: <Truck className="w-5 h-5" />,
    items: [
      { title: "Fleet", href: "/transport/fleet" },
      { title: "Trips", href: "/transport/trips" },
      { title: "Drivers", href: "/transport/drivers" },
      { title: "Logistics", href: "/transport/logistics" },
    ],
  },

  // Aviation
  {
    id: "aviation",
    title: "Aviation",
    icon: <Plane className="w-5 h-5" />,
    items: [
      { title: "Flights", href: "/aviation/flights" },
      { title: "Passengers", href: "/aviation/passengers" },
      { title: "Schedules", href: "/aviation/schedules" },
    ],
  },

  // Property Management
  {
    id: "property",
    title: "Property Management",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Units", href: "/property/units" },
      { title: "Tenants", href: "/property/tenants" },
      { title: "Leases", href: "/property/leases" },
      { title: "Maintenance", href: "/property/maintenance" },
    ],
  },

  // City / Resort Management
  {
    id: "city",
    title: "City / Resort Management",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Zones", href: "/city/zones" },
      { title: "Utilities", href: "/city/utilities" },
      { title: "Staff", href: "/city/staff" },
    ],
  },

  // Training Management
  {
    id: "training",
    title: "Training",
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { title: "Courses", href: "/training/courses" },
      { title: "Sessions", href: "/training/sessions" },
      { title: "Trainees", href: "/training/trainees" },
    ],
  },

  // Accounting
  {
    id: "accounting",
    title: "Accounting",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Chart of Accounts", href: "/accounting/coa" },
      { title: "Journal Entries", href: "/accounting/journal" },
      { title: "Billing", href: "/accounting/billing" },
      { title: "Invoices", href: "/accounting/invoices" },
    ],
  },

  // HR Management
  {
    id: "hr",
    title: "Human Resources",
    icon: <UserCog className="w-5 h-5" />,
    items: [
      { title: "Employees", href: "/hr/employees" },
      { title: "Attendance", href: "/hr/attendance" },
      { title: "Payroll", href: "/hr/payroll" },
      { title: "Leaves", href: "/hr/leaves" },
    ],
  },

  // Core ERP
  {
    id: "core",
    title: "Core ERP",
    icon: <Boxes className="w-5 h-5" />,
    items: [
      { title: "Inventory", href: "/core/inventory" },
      { title: "Vendors", href: "/core/vendors" },
      { title: "Procurement", href: "/core/procurement" },
    ],
  },
];

export function AppSidebar({ modules }: { modules?: ModuleGroup[] }) {
  const pathname = usePathname();
  const groups = modules ?? DEFAULT_MODULES;

  const initialState = useMemo(() => {
    const s: Record<string, boolean> = {};
    groups.forEach((g) => {
      s[g.id] = g.items.some((it) => it.href && pathname?.startsWith(it.href));
    });
    return s;
  }, [groups, pathname]);

  const [openGroups, setOpenGroups] =
    useState<Record<string, boolean>>(initialState);

  const toggleGroup = (id: string) =>
    setOpenGroups((p) => ({ ...p, [id]: !p[id] }));

  const isActive = (href?: string) =>
    href ? pathname === href || pathname?.startsWith(href) : false;

  return (
    // Sidebar container must have full viewport height and internal scroll
    <Sidebar className="h-screen overflow-y-auto bg-background">
        <div className="py-2">
            <h1 className="text-2xl text-center font-bold text-blue-600 ">Otithee</h1>
        </div>
      <SidebarContent aria-label="Main navigation" className="px-0">
        {groups.map((group) => {
          const opened = !!openGroups[group.id];
          const contentId = `sg-${group.id}-content`;

          return (
            <SidebarGroup key={group.id} className="border-b last:border-b-0">
              {/* Full-row button toggles group */}
              <div className="px-4">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  aria-expanded={opened}
                  aria-controls={contentId}
                  className="flex items-center justify-between w-full gap-3 rounded-md focus:outline-none "
                >
                  <div className="flex items-center gap-3 text-sm">
                    <div className="text-muted-foreground">{group.icon}</div>
                    <SidebarGroupLabel asChild>
                      <span className="select-none">{group.title}</span>
                    </SidebarGroupLabel>
                  </div>

                  <span className="text-muted-foreground">
                    {opened ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </span>
                </button>
              </div>

              <SidebarGroupContent
                id={contentId}
                className={cn("px-2 pb-2", opened ? "block" : "hidden")}
              >
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href ?? "#"}
                          className={cn(
                            "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm mt-1",
                            isActive(item.href)
                              ? "bg-blue-600 text-accent font-medium"
                              : "hover:bg-muted/50"
                          )}
                        >
                          <span>{item.title}</span>
                          {item.badge ? (
                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                              {item.badge}
                            </span>
                          ) : null}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
