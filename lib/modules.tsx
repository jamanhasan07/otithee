// lib/modules.tsx
import React from "react";
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
import { cn } from "@/lib/utils"; // keep if used elsewhere

export type NavItem = { title: string; href?: string; badge?: string | number };
export type ModuleGroup = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  items: NavItem[];
};

// NOTE: Make routes consistent — I recommend prefixing dashboard routes with /dashboard
export const DEFAULT_MODULES: ModuleGroup[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard" },
      { title: "Reports", href: "/dashboard/reports" },
    ],
  },

  {
    id: "hotel",
    title: "Hotel",
    icon: <Layers className="w-5 h-5" />,
    items: [
      // If you want clicking the module to open /dashboard/hotel, set href accordingly
      { title: "Overview", href: "/dashboard/hotel" },
      { title: "Rooms", href: "/dashboard/hotel/rooms" },
      { title: "Housekeeping", href: "/dashboard/hotel/housekeeping" },
      { title: "Maintenance", href: "/dashboard/hotel/maintenance" },
      { title: "Reservations", href: "/dashboard/hotel/reservations" },
      { title: "Front Desk", href: "/dashboard/hotel/frontdesk" },
      { title: "Guests", href: "/dashboard/hotel/guests" },
    ],
  },

  {
    id: "transport",
    title: "Transport",
    icon: <Truck className="w-5 h-5" />,
    items: [
      { title: "Fleet", href: "/dashboard/transport/fleet" },
      { title: "Trips", href: "/dashboard/transport/trips" },
      { title: "Drivers", href: "/dashboard/transport/drivers" },
      { title: "Logistics", href: "/dashboard/transport/logistics" },
    ],
  },

  {
    id: "aviation",
    title: "Aviation",
    icon: <Plane className="w-5 h-5" />,
    items: [
      { title: "Flights", href: "/dashboard/aviation/flights" },
      { title: "Passengers", href: "/dashboard/aviation/passengers" },
      { title: "Schedules", href: "/dashboard/aviation/schedules" },
    ],
  },

  {
    id: "property",
    title: "Property Management",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Units", href: "/dashboard/property/units" },
      { title: "Tenants", href: "/dashboard/property/tenants" },
      { title: "Leases", href: "/dashboard/property/leases" },
      { title: "Maintenance", href: "/dashboard/property/maintenance" },
    ],
  },

  {
    id: "city",
    title: "City / Resort Management",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Zones", href: "/dashboard/city/zones" },
      { title: "Utilities", href: "/dashboard/city/utilities" },
      { title: "Staff", href: "/dashboard/city/staff" },
    ],
  },

  {
    id: "training",
    title: "Training",
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { title: "Courses", href: "/dashboard/training/courses" },
      { title: "Sessions", href: "/dashboard/training/sessions" },
      { title: "Trainees", href: "/dashboard/training/trainees" },
    ],
  },

  {
    id: "accounting",
    title: "Accounting",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Chart of Accounts", href: "/dashboard/accounting/coa" },
      { title: "Journal Entries", href: "/dashboard/accounting/journal" },
      { title: "Billing", href: "/dashboard/accounting/billing" },
      { title: "Invoices", href: "/dashboard/accounting/invoices" },
    ],
  },

  {
    id: "hr",
    title: "Human Resources",
    icon: <UserCog className="w-5 h-5" />,
    items: [
      { title: "Employees", href: "/dashboard/hr/employees" },
      { title: "Attendance", href: "/dashboard/hr/attendance" },
      { title: "Payroll", href: "/dashboard/hr/payroll" },
      { title: "Leaves", href: "/dashboard/hr/leaves" },
    ],
  },

  {
    id: "core",
    title: "Core ERP",
    icon: <Boxes className="w-5 h-5" />,
    items: [
      { title: "Inventory", href: "/dashboard/core/inventory" },
      { title: "Vendors", href: "/dashboard/core/vendors" },
      { title: "Procurement", href: "/dashboard/core/procurement" },
    ],
  },
];

// Hotel-specific modules (module sidebar for /dashboard/hotel)
export const HOTEL_MODULES: ModuleGroup[] = [
  {
    id: "hotel",
    title: "Hotel",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard/hotel" },
      { title: "Rooms", href: "/dashboard/hotel/rooms" },
      { title: "Housekeeping", href: "/dashboard/hotel/housekeeping" },
      { title: "Maintenance", href: "/dashboard/hotel/maintenance" },
    ],
  },
];
