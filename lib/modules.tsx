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
  Users,
  Radar,
  Landmark,
  Settings,
  RadarIcon,
  Wrench,
  ClipboardList,
  CalendarDays,
  Trees,
  TreesIcon,
  BookOpen,
  BookOpenIcon,
  Receipt,
  Wallet,
  BarChart2,
  ReceiptIcon,
  ShoppingCart,
  RefreshCw,
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
      { title: "Overview", href: "/hotel" },
      { title: "Rooms", href: "/hotel/rooms" },
      { title: "Housekeeping", href: "/hotel/housekeeping" },
      { title: "Maintenance", href: "/hotel/maintenance" },
      { title: "Reservations", href: "/hotel/reservations" },
      { title: "Front Desk", href: "/hotel/frontdesk" },
      { title: "Guests", href: "/hotel/guests" },
    ],
  },

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

  {
    id: "aviation",
    title: "Aviation",
    icon: <Plane className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/aviation" },
      { title: "Flights", href: "/aviation/flights" },
      { title: "Passengers", href: "/aviation/passengers" },
      { title: "Schedules", href: "/aviation/schedules" },
    ],
  },

  {
    id: "property",
    title: "Property Management",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/property" },
      { title: "Units", href: "/property/units" },
      { title: "Tenants", href: "/property/tenants" },
      { title: "Leases", href: "/property/leases" },
      { title: "Maintenance", href: "/property/maintenance" },
    ],
  },

  {
    id: "city",
    title: "City / Resort Management",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/city" },
      { title: "Zones", href: "/city/zones" },
      { title: "Utilities", href: "/city/utilities" },
      { title: "Staff", href: "/city/staff" },
    ],
  },

  {
    id: "training",
    title: "Training",
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/training" },
      { title: "Courses", href: "/training/courses" },
      { title: "Sessions", href: "/training/sessions" },
      { title: "Trainees", href: "/training/trainees" },
    ],
  },

  {
    id: "accounting",
    title: "Accounting",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/accounting" },
      { title: "Chart of Accounts", href: "/accounting/coa" },
      { title: "Journal Entries", href: "/accounting/journal" },
      { title: "Billing", href: "/accounting/billing" },
      { title: "Invoices", href: "/accounting/invoices" },
    ],
  },

  {
    id: "hr",
    title: "Human Resources",
    icon: <UserCog className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/hr" },
      { title: "Employees", href: "/hr/employees" },
      { title: "Attendance", href: "/hr/attendance" },
      { title: "Payroll", href: "/hr/payroll" },
      { title: "Leaves", href: "/hr/leaves" },
    ],
  },

  {
    id: "core",
    title: "Core ERP",
    icon: <Boxes className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/core" },
      { title: "Inventory", href: "/core/inventory" },
      { title: "Vendors", href: "/core/vendors" },
      { title: "Procurement", href: "/core/procurement" },
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
      { title: "Overview", href: "/hotel" },
      { title: "Rooms", href: "/hotel/rooms" },
      { title: "Housekeeping", href: "/hotel/housekeeping" },
      { title: "Maintenance", href: "/hotel/maintenance" },
    ],
  },
  {
    id: "frontdesk",
    title: "Front Desk & Reservations",
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        title: "Walk-in & Phone Reservations",
        href: "/hotel/frontdesk/walkin",
      },
      {
        title: "Check-in / Check-out",
        href: "/hotel/frontdesk/checkin",
      },
      {
        title: "Guest Stay Management",
        href: "/hotel/frontdesk/stay",
      },
      {
        title: "Room Assignment",
        href: "/hotel/frontdesk/assignment",
      },
      {
        title: "Folio Creation & Updates",
        href: "/hotel/frontdesk/folio",
      },
    ],
  },

  {
    id: "roominventory",
    title: "Room Inventory",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Room Status", href: "/hotel/rooms/status" }, // Vacant / Occupied / Dirty / OOS
      { title: "Room Types & Rates", href: "/hotel/rooms/types" },
      {
        title: "Floor & Building Mapping",
        href: "/hotel/rooms/floors",
      },
    ],
  },

  {
    id: "housekeeping",
    title: "Housekeeping",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Task Assignment", href: "/hotel/housekeeping/tasks" },
      {
        title: "Task Scheduling",
        href: "/hotel/housekeeping/schedule",
      },
      { title: "Status Updates", href: "/hotel/housekeeping/status" },
      {
        title: "Turnover Tracking",
        href: "/hotel/housekeeping/turnover",
      },
    ],
  },

  {
    id: "maintenance",
    title: "Maintenance / Engineering",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Work Orders", href: "/hotel/maintenance/workorders" },
      { title: "Issue Tracking", href: "/hotel/maintenance/issues" },
      {
        title: "Asset Management",
        href: "/hotel/maintenance/assets",
      },
      {
        title: "Technician Assignment",
        href: "/hotel/maintenance/technicians",
      },
    ],
  },

  {
    id: "fnb",
    title: "Food & Beverage (F&B) + POS",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "POS Billing", href: "/hotel/fnb/pos" },
      { title: "Menu Setup", href: "/hotel/fnb/menu" },
      { title: "KOT / BOT Management", href: "/hotel/fnb/kotbot" },
      { title: "Post to Guest Folio", href: "/hotel/fnb/postings" },
    ],
  },

  {
    id: "billing",
    title: "Billing & Folios",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Folio Management", href: "/hotel/billing/folios" },
      { title: "Room Charges", href: "/hotel/billing/roomcharges" },
      { title: "Additional Charges", href: "/hotel/billing/addons" },
      {
        title: "Payments & Tax Handling",
        href: "/hotel/billing/payments",
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
        href: "/hotel/inventory/stocks",
      },
      { title: "Item Tracking", href: "/hotel/inventory/items" },
      { title: "Purchase Orders", href: "/hotel/inventory/po" },
    ],
  },

  {
    id: "staff",
    title: "Staff & Role Management",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "User Accounts", href: "/hotel/staff/users" },
      { title: "Roles & Permissions", href: "/hotel/staff/roles" },
      { title: "Duty Roster", href: "/hotel/staff/roster" },
    ],
  },

  {
    id: "reports",
    title: "Reports & Analytics",
    icon: <Layers className="w-5 h-5" />,
    items: [
      {
        title: "Occupancy Reports",
        href: "/hotel/reports/occupancy",
      },
      {
        title: "Daily Revenue Reports",
        href: "/hotel/reports/revenue",
      },
      {
        title: "Housekeeping Performance",
        href: "/hotel/reports/housekeeping",
      },
      {
        title: "Department Summaries",
        href: "/hotel/reports/department",
      },
    ],
  },
];

// Transport-specific modules (sidebar for /transport)
export const TRANSPORT_MODULES: ModuleGroup[] = [
  {
    id: "transport",
    title: "Ride Sharing & Transportation",
    icon: <Truck className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/dashboard/transport" },
      {
        title: "Ride Booking (On-demand)",
        href: "/dashboard/transport/ride-booking",
      },
      { title: "Scheduled Trips", href: "/dashboard/transport/scheduled" },
      {
        title: "Live Tracking (GPS)",
        href: "/dashboard/transport/live-tracking",
      },
      { title: "Drivers", href: "/dashboard/transport/drivers" },
      {
        title: "Driver Roster & Assignment",
        href: "/dashboard/transport/drivers/assignments",
      },
      { title: "Fleet Management", href: "/dashboard/transport/fleet" },
      {
        title: "Maintenance & Inspections",
        href: "/dashboard/transport/fleet/maintenance",
      },
      { title: "Fuel Logs", href: "/dashboard/transport/fleet/fuel-logs" },
      { title: "Fare & Billing", href: "/dashboard/transport/billing" },
      {
        title: "Trip History & Analytics",
        href: "/dashboard/transport/analytics",
      },
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
      {
        title: "Maintenance Work Orders",
        href: "/dashboard/transport/fleet/maintenance",
      },
      {
        title: "Inspection Logs",
        href: "/dashboard/transport/fleet/inspections",
      },
      {
        title: "Fuel & Expense Logs",
        href: "/dashboard/transport/fleet/fuel-logs",
      },
    ],
  },

  {
    id: "transport-ops",
    title: "Operations",
    icon: <ChevronRight className="w-5 h-5" />,
    items: [
      { title: "Dispatch Board", href: "/dashboard/transport/ops/dispatch" },
      {
        title: "Driver Assignments",
        href: "/dashboard/transport/ops/assignments",
      },
      { title: "Schedules", href: "/dashboard/transport/ops/schedules" },
    ],
  },

  {
    id: "transport-billing",
    title: "Billing & Analytics",
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        title: "Fare Rules & Setup",
        href: "/dashboard/transport/billing/fare-setup",
      },
      {
        title: "Invoices & Payments",
        href: "/dashboard/transport/billing/invoices",
      },
      { title: "Trip Analytics", href: "/dashboard/transport/analytics" },
      {
        title: "Revenue Reports",
        href: "/dashboard/transport/reports/revenue",
      },
    ],
  },
];




export const AVIATION_MODULES: ModuleGroup[] = [
  {
    id: "aviation",
    title: "Aviation Operations",
    icon: <Plane className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/aviation" },
      { title: "Live Flights", href: "/aviation/live" },
      { title: "Flight Schedule", href: "/aviation/schedule" },
      { title: "Flight Dispatch", href: "/aviation/dispatch" },
    ],
  },

  {
    id: "airportops",
    title: "Airport Operations",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Check-in & Boarding", href: "/aviation/airport/checkin" },
      { title: "Gate Management", href: "/aviation/airport/gates" },
      { title: "Terminal Operations", href: "/aviation/airport/terminal" },
      { title: "Passenger Movement", href: "/aviation/airport/passengers" },
      { title: "Lost & Found", href: "/aviation/airport/lostfound" },
    ],
  },

  {
    id: "runway",
    title: "Runway & Ground Control",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Runway Status", href: "/aviation/runway/status" },
      { title: "Ground Movements", href: "/aviation/runway/ground" },
      { title: "Clearance & Safety", href: "/aviation/runway/safety" },
    ],
  },

  {
    id: "fleet",
    title: "Aircraft Fleet Management",
    icon: <RadarIcon className="w-5 h-5" />,
    items: [
      { title: "Aircraft List", href: "/aviation/fleet" },
      { title: "Maintenance Status", href: "/aviation/fleet/maintenance" },
      { title: "Parts & Components", href: "/aviation/fleet/parts" },
      { title: "Technical Logs (TechLog)", href: "/aviation/fleet/techlog" },
    ],
  },

  {
    id: "crew",
    title: "Crew & Staff",
    icon: <Users className="w-5 h-5" />,
    items: [
      { title: "Flight Crew", href: "/aviation/crew/flight" },
      { title: "Cabin Crew", href: "/aviation/crew/cabin" },
      { title: "Duty Roster", href: "/aviation/crew/roster" },
      { title: "Training & Certification", href: "/aviation/crew/training" },
    ],
  },

  {
    id: "atc",
    title: "ATC & Navigation",
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { title: "ATC Logs", href: "/aviation/atc/logs" },
      { title: "Flight Paths", href: "/aviation/atc/paths" },
      { title: "Weather & METAR", href: "/aviation/atc/weather" },
      { title: "Communication Records", href: "/aviation/atc/comms" },
    ],
  },

  {
    id: "baggage",
    title: "Baggage & Cargo",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Baggage Handling", href: "/aviation/baggage/handling" },
      { title: "Cargo Management", href: "/aviation/baggage/cargo" },
      { title: "Load & Balance", href: "/aviation/baggage/load" },
    ],
  },

  {
    id: "billing",
    title: "Billing & Aviation Finance",
    icon: <Settings className="w-5 h-5" />,
    items: [
      { title: "Flight Charges", href: "/aviation/billing/flightcharges" },
      { title: "Fuel Billing", href: "/aviation/billing/fuel" },
      { title: "Landing Fees", href: "/aviation/billing/landing" },
      { title: "Cargo Billing", href: "/aviation/billing/cargo" },
    ],
  },

  {
    id: "reports",
    title: "Reports & Analytics",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Flight Statistics", href: "/aviation/reports/flights" },
      { title: "Delay Reports", href: "/aviation/reports/delays" },
      { title: "Operational Efficiency", href: "/aviation/reports/efficiency" },
      { title: "Crew Performance", href: "/aviation/reports/crew" },
    ],
  },
];





export const PROPERTY_MODULES: ModuleGroup[] = [
  {
    id: "property",
    title: "Property Management",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/property" },
      { title: "Units", href: "/property/units" },
      { title: "Tenants", href: "/property/tenants" },
      { title: "Leases & Contracts", href: "/property/leases" },
      { title: "Rent Collection", href: "/property/rent" },
    ],
  },

  {
    id: "maintenance",
    title: "Maintenance & Engineering",
    icon: <Wrench className="w-5 h-5" />,
    items: [
      { title: "Work Orders", href: "/property/maintenance/workorders" },
      { title: "Issue Tracking", href: "/property/maintenance/issues" },
      { title: "Asset Management", href: "/property/maintenance/assets" },
      { title: "Technician Scheduling", href: "/property/maintenance/technicians" },
    ],
  },

  {
    id: "inspections",
    title: "Inspections & Compliance",
    icon: <ClipboardList className="w-5 h-5" />,
    items: [
      { title: "Property Inspections", href: "/property/inspections" },
      { title: "Move-in / Move-out Checklist", href: "/property/inspections/moveinout" },
      { title: "Safety & Compliance", href: "/property/inspections/safety" },
    ],
  },

  {
    id: "finance",
    title: "Billing & Finance",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Invoices", href: "/property/billing/invoices" },
      { title: "Payments", href: "/property/billing/payments" },
      { title: "Expense Tracking", href: "/property/billing/expenses" },
      { title: "Utility Billing", href: "/property/billing/utilities" },
    ],
  },

  {
    id: "community",
    title: "Community & Facilities",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Facilities", href: "/property/facilities" },
      { title: "Bookings", href: "/property/bookings" },
      { title: "Announcements", href: "/property/announcements" },
      { title: "Complaints & Requests", href: "/property/requests" },
    ],
  },

  {
    id: "staff",
    title: "Staff & Roles",
    icon: <Users className="w-5 h-5" />,
    items: [
      { title: "Staff Directory", href: "/property/staff" },
      { title: "Roles & Permissions", href: "/property/staff/roles" },
      { title: "Duty Roster", href: "/property/staff/roster" },
    ],
  },
];




export const CITY_RESORT_MODULES: ModuleGroup[] = [
  {
    id: "city_resort",
    title: "City & Resort Management",
    icon: <Map className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/city" },
      { title: "Zones & Areas", href: "/city/zones" },
      { title: "Facilities", href: "/city/facilities" },
      { title: "Resort Dashboard", href: "/city/resort" },
    ],
  },

  {
    id: "facility_ops",
    title: "Facility Operations",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Pools & Recreation", href: "/city/facilities/pools" },
      { title: "Restaurants & Lounges", href: "/city/facilities/restaurants" },
      { title: "Sports & Activities", href: "/city/facilities/sports" },
      { title: "Event Spaces", href: "/city/facilities/events" },
    ],
  },

  {
    id: "guest_services",
    title: "Guest & Resident Services",
    icon: <Users className="w-5 h-5" />,
    items: [
      { title: "Guest Directory", href: "/city/guests" },
      { title: "Check-in & Registration", href: "/city/guests/checkin" },
      { title: "Requests & Complaints", href: "/city/guests/requests" },
      { title: "Membership & Loyalty", href: "/city/guests/membership" },
    ],
  },

  {
    id: "events",
    title: "Events & Scheduling",
    icon: <CalendarDays className="w-5 h-5" />,
    items: [
      { title: "Events Calendar", href: "/city/events" },
      { title: "Bookings", href: "/city/events/bookings" },
      { title: "Resource Allocation", href: "/city/events/resources" },
    ],
  },

  {
    id: "maintenance",
    title: "Maintenance & Infrastructure",
    icon: <Wrench className="w-5 h-5" />,
    items: [
      { title: "Maintenance Requests", href: "/city/maintenance" },
      { title: "Utilities & Services", href: "/city/maintenance/utilities" },
      { title: "Asset Tracking", href: "/city/maintenance/assets" },
      { title: "Groundskeeping", href: "/city/maintenance/grounds" },
    ],
  },

  {
    id: "environment",
    title: "Environment & Sustainability",
    icon: <TreesIcon className="w-5 h-5" />,
    items: [
      { title: "Green Zones", href: "/city/environment/greenzones" },
      { title: "Waste Management", href: "/city/environment/waste" },
      { title: "Energy Usage", href: "/city/environment/energy" },
      { title: "Water Supply", href: "/city/environment/water" },
    ],
  },

  {
    id: "city_finance",
    title: "Billing & Finance",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Billing Overview", href: "/city/billing" },
      { title: "Service Charges", href: "/city/billing/services" },
      { title: "Facility Billing", href: "/city/billing/facilities" },
      { title: "Reports", href: "/city/billing/reports" },
    ],
  },

  {
    id: "security",
    title: "Security & Governance",
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { title: "Access Control", href: "/city/security/access" },
      { title: "CCTV Monitoring", href: "/city/security/cctv" },
      { title: "Incident Reports", href: "/city/security/incidents" },
      { title: "Emergency Protocols", href: "/city/security/emergency" },
    ],
  },
];



export const TRAINING_MODULES: ModuleGroup[] = [
  {
    id: "training",
    title: "Training Management",
    icon: <GraduationCap className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/training" },
      { title: "Dashboard", href: "/training/dashboard" },
      { title: "Learning Paths", href: "/training/paths" },
      { title: "Categories", href: "/training/categories" },
    ],
  },

  {
    id: "courses",
    title: "Courses & Content",
    icon: <BookOpenIcon className="w-5 h-5" />,
    items: [
      { title: "All Courses", href: "/training/courses" },
      { title: "Course Builder", href: "/training/courses/builder" },
      { title: "Modules & Lessons", href: "/training/courses/modules" },
      { title: "Assessments", href: "/training/courses/assessments" },
    ],
  },

  {
    id: "sessions",
    title: "Sessions & Scheduling",
    icon: <CalendarDays className="w-5 h-5" />,
    items: [
      { title: "Session Calendar", href: "/training/sessions" },
      { title: "Workshops", href: "/training/sessions/workshops" },
      { title: "Webinars & Live Classes", href: "/training/sessions/live" },
      { title: "Training Venues", href: "/training/sessions/venues" },
    ],
  },

  {
    id: "trainees",
    title: "Trainees & Enrollment",
    icon: <Users className="w-5 h-5" />,
    items: [
      { title: "Trainee Directory", href: "/training/trainees" },
      { title: "Enrollments", href: "/training/trainees/enrollments" },
      { title: "Attendance Tracking", href: "/training/trainees/attendance" },
      { title: "Feedback & Reviews", href: "/training/trainees/feedback" },
    ],
  },

  {
    id: "exams",
    title: "Exams & Certifications",
    icon: <ClipboardList className="w-5 h-5" />,
    items: [
      { title: "Exam Center", href: "/training/exams" },
      { title: "MCQ & Written Tests", href: "/training/exams/tests" },
      { title: "Practical Exams", href: "/training/exams/practical" },
      { title: "Certification Issuance", href: "/training/exams/certificates" },
    ],
  },

  {
    id: "reports",
    title: "Reports & Analytics",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Learner Progress", href: "/training/reports/progress" },
      { title: "Course Performance", href: "/training/reports/courses" },
      { title: "Instructor Performance", href: "/training/reports/instructors" },
      { title: "Session Analytics", href: "/training/reports/sessions" },
    ],
  },
];




export const ACCOUNTING_MODULES: ModuleGroup[] = [
  {
    id: "accounting",
    title: "Accounting & Finance",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/accounting" },
      { title: "Financial Dashboard", href: "/accounting/dashboard" },
      { title: "Chart of Accounts", href: "/accounting/coa" },
      { title: "General Ledger", href: "/accounting/gl" },
      { title: "Journal Entries", href: "/accounting/journal" },
    ],
  },

  {
    id: "billing",
    title: "Billing & Invoicing",
    icon: <ReceiptIcon className="w-5 h-5" />,
    items: [
      { title: "Invoices", href: "/accounting/invoices" },
      { title: "Customer Billing", href: "/accounting/billing/customers" },
      { title: "Vendor Billing", href: "/accounting/billing/vendors" },
      { title: "Recurring Billing", href: "/accounting/billing/recurring" },
      { title: "Credit Notes", href: "/accounting/billing/credits" },
    ],
  },

  {
    id: "payments",
    title: "Payments & Receipts",
    icon: <Wallet className="w-5 h-5" />,
    items: [
      { title: "Receive Payments", href: "/accounting/payments/receive" },
      { title: "Make Payments", href: "/accounting/payments/make" },
      { title: "Bank Register", href: "/accounting/payments/banks" },
      { title: "Cash Register", href: "/accounting/payments/cash" },
      { title: "Reconciliations", href: "/accounting/payments/reconcile" },
    ],
  },

  {
    id: "taxation",
    title: "Taxation & Compliance",
    icon: <Landmark className="w-5 h-5" />,
    items: [
      { title: "Tax Setup (VAT/GST)", href: "/accounting/tax/setup" },
      { title: "Tax Reports", href: "/accounting/tax/reports" },
      { title: "Withholding Tax", href: "/accounting/tax/wht" },
      { title: "Regulatory Filing", href: "/accounting/tax/filing" },
    ],
  },

  {
    id: "reports",
    title: "Reports & Statements",
    icon: <BarChart2 className="w-5 h-5" />,
    items: [
      { title: "Balance Sheet", href: "/accounting/reports/balancesheet" },
      { title: "Profit & Loss", href: "/accounting/reports/pl" },
      { title: "Cash Flow", href: "/accounting/reports/cashflow" },
      { title: "A/R & A/P", href: "/accounting/reports/ar-ap" },
      { title: "Trial Balance", href: "/accounting/reports/trialbalance" },
    ],
  },
];




export const CORE_ERP_MODULES: ModuleGroup[] = [
  {
    id: "core",
    title: "Core ERP",
    icon: <Boxes className="w-5 h-5" />,
    items: [
      { title: "Overview", href: "/core" },
      { title: "ERP Dashboard", href: "/core/dashboard" },
      { title: "Master Data", href: "/core/masterdata" },
      { title: "Audit Logs", href: "/core/audit" },
    ],
  },

  {
    id: "inventory",
    title: "Inventory Management",
    icon: <Layers className="w-5 h-5" />,
    items: [
      { title: "Inventory Overview", href: "/core/inventory" },
      { title: "Products & SKUs", href: "/core/inventory/products" },
      { title: "Stock Levels", href: "/core/inventory/stock" },
      { title: "Stock Movements", href: "/core/inventory/movements" },
      { title: "Warehouses", href: "/core/inventory/warehouses" },
      { title: "Batch & Serial Tracking", href: "/core/inventory/tracking" },
    ],
  },

  {
    id: "procurement",
    title: "Procurement",
    icon: <ShoppingCart className="w-5 h-5" />,
    items: [
      { title: "Purchase Requests", href: "/core/procurement/requests" },
      { title: "Purchase Orders", href: "/core/procurement/orders" },
      { title: "Goods Received Notes", href: "/core/procurement/grn" },
      { title: "Vendor Quotations", href: "/core/procurement/quotations" },
      { title: "Vendor Performance", href: "/core/procurement/vendors" },
    ],
  },

  {
    id: "assets",
    title: "Asset Management",
    icon: <Building2 className="w-5 h-5" />,
    items: [
      { title: "Assets Overview", href: "/core/assets" },
      { title: "Asset Register", href: "/core/assets/register" },
      { title: "Depreciation", href: "/core/assets/depreciation" },
      { title: "Asset Movement", href: "/core/assets/movement" },
      { title: "Asset Disposal", href: "/core/assets/disposal" },
    ],
  },

  {
    id: "maintenance",
    title: "Maintenance",
    icon: <Wrench className="w-5 h-5" />,
    items: [
      { title: "Maintenance Dashboard", href: "/core/maintenance" },
      { title: "Work Orders", href: "/core/maintenance/workorders" },
      { title: "Preventive Maintenance", href: "/core/maintenance/preventive" },
      { title: "Maintenance Logs", href: "/core/maintenance/logs" },
      { title: "Technician Assignment", href: "/core/maintenance/technicians" },
    ],
  },

  {
    id: "vendors",
    title: "Vendor Management",
    icon: <Users className="w-5 h-5" />,
    items: [
      { title: "Vendor List", href: "/core/vendors" },
      { title: "Vendor Categories", href: "/core/vendors/categories" },
      { title: "Contracts", href: "/core/vendors/contracts" },
      { title: "Payment Terms", href: "/core/vendors/paymentterms" },
    ],
  },

  {
    id: "compliance",
    title: "Compliance & Policies",
    icon: <FileText className="w-5 h-5" />,
    items: [
      { title: "Policies & SOP", href: "/core/compliance/policies" },
      { title: "Internal Controls", href: "/core/compliance/controls" },
      { title: "Regulatory Compliance", href: "/core/compliance/regulatory" },
      { title: "Risk Management", href: "/core/compliance/risk" },
    ],
  },

  {
    id: "system",
    title: "System Administration",
    icon: <RefreshCw className="w-5 h-5" />,
    items: [
      { title: "System Settings", href: "/core/system/settings" },
      { title: "Integrations", href: "/core/system/integrations" },
      { title: "User Access Control", href: "/core/system/access" },
      { title: "API Keys", href: "/core/system/api" },
      { title: "Backups", href: "/core/system/backups" },
    ],
  },
];
