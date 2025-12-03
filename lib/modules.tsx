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
    title: "Hotel & Resort Management",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard/hotel" },
      { title: "Rooms", href: "/dashboard/hotel/rooms" },
      { title: "Housekeeping", href: "/dashboard/hotel/housekeeping" },
      { title: "Maintenance", href: "/dashboard/hotel/maintenance" },
    ],
  },
  {
    id: "frontdesk",
    title: "Front Desk & Reservations",
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        title: "Walk-in & Phone Reservations",
        href: "/dashboard/hotel/frontdesk/walkin",
      },
      {
        title: "Check-in / Check-out",
        href: "/dashboard/hotel/frontdesk/checkin",
      },
      {
        title: "Guest Stay Management",
        href: "/dashboard/hotel/frontdesk/stay",
      },
      {
        title: "Room Assignment",
        href: "/dashboard/hotel/frontdesk/assignment",
      },
      {
        title: "Folio Creation & Updates",
        href: "/dashboard/hotel/frontdesk/folio",
      },
    ],
  },

  {
    id: "roominventory",
    title: "Room Inventory",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Room Status", href: "/dashboard/hotel/rooms/status" }, // Vacant / Occupied / Dirty / OOS
      { title: "Room Types & Rates", href: "/dashboard/hotel/rooms/types" },
      {
        title: "Floor & Building Mapping",
        href: "/dashboard/hotel/rooms/floors",
      },
    ],
  },

  {
    id: "housekeeping",
    title: "Housekeeping",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Task Assignment", href: "/dashboard/hotel/housekeeping/tasks" },
      {
        title: "Task Scheduling",
        href: "/dashboard/hotel/housekeeping/schedule",
      },
      { title: "Status Updates", href: "/dashboard/hotel/housekeeping/status" },
      {
        title: "Turnover Tracking",
        href: "/dashboard/hotel/housekeeping/turnover",
      },
    ],
  },

  {
    id: "maintenance",
    title: "Maintenance / Engineering",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Work Orders", href: "/dashboard/hotel/maintenance/workorders" },
      { title: "Issue Tracking", href: "/dashboard/hotel/maintenance/issues" },
      {
        title: "Asset Management",
        href: "/dashboard/hotel/maintenance/assets",
      },
      {
        title: "Technician Assignment",
        href: "/dashboard/hotel/maintenance/technicians",
      },
    ],
  },

  {
    id: "fnb",
    title: "Food & Beverage (F&B) + POS",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "POS Billing", href: "/dashboard/hotel/fnb/pos" },
      { title: "Menu Setup", href: "/dashboard/hotel/fnb/menu" },
      { title: "KOT / BOT Management", href: "/dashboard/hotel/fnb/kotbot" },
      { title: "Post to Guest Folio", href: "/dashboard/hotel/fnb/postings" },
    ],
  },

  {
    id: "billing",
    title: "Billing & Folios",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Folio Management", href: "/dashboard/hotel/billing/folios" },
      { title: "Room Charges", href: "/dashboard/hotel/billing/roomcharges" },
      { title: "Additional Charges", href: "/dashboard/hotel/billing/addons" },
      {
        title: "Payments & Tax Handling",
        href: "/dashboard/hotel/billing/payments",
      },
    ],
  },

  {
    id: "inventory",
    title: "Inventory & Purchasing",
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        title: "Stock & Consumables",
        href: "/dashboard/hotel/inventory/stocks",
      },
      { title: "Item Tracking", href: "/dashboard/hotel/inventory/items" },
      { title: "Purchase Orders", href: "/dashboard/hotel/inventory/po" },
    ],
  },

  {
    id: "staff",
    title: "Staff & Role Management",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "User Accounts", href: "/dashboard/hotel/staff/users" },
      { title: "Roles & Permissions", href: "/dashboard/hotel/staff/roles" },
      { title: "Duty Roster", href: "/dashboard/hotel/staff/roster" },
    ],
  },

  {
    id: "reports",
    title: "Reports & Analytics",
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        title: "Occupancy Reports",
        href: "/dashboard/hotel/reports/occupancy",
      },
      {
        title: "Daily Revenue Reports",
        href: "/dashboard/hotel/reports/revenue",
      },
      {
        title: "Housekeeping Performance",
        href: "/dashboard/hotel/reports/housekeeping",
      },
      {
        title: "Department Summaries",
        href: "/dashboard/hotel/reports/department",
      },
    ],
  },
];



// Transport-specific modules (sidebar for /dashboard/transport)
export const TRANSPORT_MODULES: ModuleGroup[] = [
  {
    id: "transport",
    title: "Ride Sharing & Transportation",
    icon: <Truck className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard/transport" },
      { title: "Ride Booking (On-demand)", href: "/dashboard/transport/ride-booking" },
      { title: "Scheduled Trips", href: "/dashboard/transport/scheduled" },
      { title: "Live Tracking (GPS)", href: "/dashboard/transport/live-tracking" },
      { title: "Drivers", href: "/dashboard/transport/drivers" },
      { title: "Driver Roster & Assignment", href: "/dashboard/transport/drivers/assignments" },
      { title: "Fleet Management", href: "/dashboard/transport/fleet" },
      { title: "Maintenance & Inspections", href: "/dashboard/transport/fleet/maintenance" },
      { title: "Fuel Logs", href: "/dashboard/transport/fleet/fuel-logs" },
      { title: "Fare & Billing", href: "/dashboard/transport/billing" },
      { title: "Trip History & Analytics", href: "/dashboard/transport/analytics" },
      { title: "Reports", href: "/dashboard/transport/reports" },
    ],
  },

  // Optional: smaller groups for focused sub-sidebars
  {
    id: "transport-fleet",
    title: "Fleet & Maintenance",
    icon: <Truck className="w-5 h-5" />,
    items: [
      { title: "Fleet Overview", href: "/dashboard/transport/fleet" },
      { title: "Maintenance Work Orders", href: "/dashboard/transport/fleet/maintenance" },
      { title: "Inspection Logs", href: "/dashboard/transport/fleet/inspections" },
      { title: "Fuel & Expense Logs", href: "/dashboard/transport/fleet/fuel-logs" },
    ],
  },

  {
    id: "transport-ops",
    title: "Operations",
    icon: <ChevronRight className="w-5 h-5" />,
    items: [
      { title: "Dispatch Board", href: "/dashboard/transport/ops/dispatch" },
      { title: "Driver Assignments", href: "/dashboard/transport/ops/assignments" },
      { title: "Schedules", href: "/dashboard/transport/ops/schedules" },
    ],
  },

  {
    id: "transport-billing",
    title: "Billing & Analytics",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Fare Rules & Setup", href: "/dashboard/transport/billing/fare-setup" },
      { title: "Invoices & Payments", href: "/dashboard/transport/billing/invoices" },
      { title: "Trip Analytics", href: "/dashboard/transport/analytics" },
      { title: "Revenue Reports", href: "/dashboard/transport/reports/revenue" },
    ],
  },
];