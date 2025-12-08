"use client";

import React from "react";
import {
  Building2,
  Users,
  Wrench,
  ClipboardList,
  FileText,
  Map,
  ChevronRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";

// Property Overview — international-standard layout matching Transport/Aviation pages
// - 12-column responsive grid
// - KPI stat cards with sparklines
// - Mini map / building preview + unit list
// - Accessible markup and ready for API integration

type StatCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  accent: "blue" | "green" | "yellow" | "purple" | "pink";
  icon?: React.ReactNode;
  sparkline?: number[];
};

// local type includes id used for mapping keys
type StatItem = StatCardProps & { id: string };

function Sparkline({ data = [] }: { data?: number[] }) {
  if (!data || data.length === 0) return null;
  const w = 72;
  const h = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const normalize = (v: number) =>
    max === min ? h / 2 : h - ((v - min) / (max - min)) * h;
  const path = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * w} ${normalize(d)}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ title, subtitle, value, accent, icon, sparkline }: StatCardProps) {
  const accentMap: Record<string, { ring: string; text: string; border: string }> = {
    blue: { ring: "from-sky-100 to-sky-200", text: "text-sky-500", border: "border-sky-100" },
    green: { ring: "from-emerald-100 to-emerald-200", text: "text-emerald-500", border: "border-emerald-100" },
    yellow: { ring: "from-amber-100 to-amber-200", text: "text-amber-500", border: "border-amber-100" },
    purple: { ring: "from-violet-100 to-violet-200", text: "text-violet-500", border: "border-violet-100" },
    pink: { ring: "from-pink-100 to-pink-200", text: "text-pink-500", border: "border-pink-100" },
  };
  const ac = accentMap[accent];

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className={`relative bg-white/95 dark:bg-neutral-900/80 border ${ac.border} p-4 rounded-2xl shadow-md`}
      role="region"
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${ac.ring} bg-opacity-40`}>{icon}</div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`text-2xl font-extrabold ${ac.text}`}>{value}</div>
          {sparkline && <div className="text-neutral-400 w-20"><Sparkline data={sparkline} /></div>}
        </div>
      </div>
    </motion.article>
  );
}

function MiniPropertyMap() {
  // Simple stylized building map — replace with real map integration when ready
  return (
    <svg viewBox="0 0 260 140" preserveAspectRatio="none" className="w-full h-44 rounded-lg overflow-hidden">
      <rect width="100%" height="100%" fill="#0b122020" />
      <g transform="translate(20,20)">
        <rect x="0" y="20" width="60" height="80" rx="6" fill="#e6eefc" />
        <rect x="80" y="0" width="120" height="120" rx="8" fill="#cfe9f9" />
        <rect x="210" y="30" width="30" height="70" rx="4" fill="#dbeafe" />
      </g>
      <circle cx="40" cy="110" r="4" fill="#06b6d4" />
      <circle cx="200" cy="40" r="4" fill="#60a5fa" />
    </svg>
  );
}

function UnitList({ units }: { units: Array<{ id: string; status: "occupied" | "vacant" | "maintenance"; tenant?: string }> }) {
  return (
    <div className="space-y-3">
      {units.map((u) => (
        <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
              <Building2 className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-semibold">Unit {u.id}</div>
              <div className="text-xs text-neutral-400">{u.tenant ?? (u.status === "vacant" ? "Vacant" : u.status === "maintenance" ? "Under maintenance" : "Occupied")}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`text-xs px-2 py-1 rounded-full ${u.status === "occupied" ? "bg-emerald-100 text-emerald-700" : u.status === "vacant" ? "bg-amber-100 text-amber-700" : "bg-neutral-100 text-neutral-700"}`}>
              {u.status}
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function PropertyOverview() {
  // TYPE-SAFE stats array (include id for keys)
  const stats: StatItem[] = [
    {
      id: "units",
      title: "Total Units",
      subtitle: "All buildings",
      value: 128,
      accent: "blue",
      icon: <Building2 className="w-5 h-5" />,
      sparkline: [80, 82, 84, 86, 88, 90, 92],
    },
    {
      id: "occupied",
      title: "Occupied",
      subtitle: "Current",
      value: 96,
      accent: "green",
      icon: <Users className="w-5 h-5" />,
      sparkline: [70, 72, 75, 78, 82, 88, 96],
    },
    {
      id: "open",
      title: "Open Tickets",
      subtitle: "Maintenance",
      value: 12,
      accent: "yellow",
      icon: <Wrench className="w-5 h-5" />,
      sparkline: [5, 6, 8, 10, 9, 11, 12],
    },
    {
      id: "inspections",
      title: "Pending Inspections",
      subtitle: "This week",
      value: 5,
      accent: "purple",
      icon: <ClipboardList className="w-5 h-5" />,
      sparkline: [2, 2, 3, 4, 4, 5, 5],
    },
    {
      id: "billing",
      title: "Billing Alerts",
      subtitle: "Overdue",
      value: 3,
      accent: "pink",
      icon: <FileText className="w-5 h-5" />,
      sparkline: [1, 2, 1, 3, 2, 3, 3],
    },
  ];

  // TYPE-SAFE units array
  const units: Array<{ id: string; status: "occupied" | "vacant" | "maintenance"; tenant?: string }> = [
    { id: "101", status: "occupied", tenant: "John Doe" },
    { id: "102", status: "vacant" },
    { id: "103", status: "maintenance" },
    { id: "104", status: "occupied", tenant: "Acme Corp" },
  ];

  return (
    <section className="p-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Property Overview</h1>
          <p className="text-sm text-neutral-500">Manage buildings, units, tenants and maintenance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        {/* Row 1: KPI cards */}
        {stats.slice(0, 3).map((s) => (
          <div key={s.id} className="col-span-12 sm:col-span-4">
            <StatCard {...s} />
          </div>
        ))}

        {/* Row 2: Map/Preview (8 cols) + Units list (4 cols) */}
        <motion.div whileHover={{ y: -6 }} className="col-span-12 lg:col-span-8 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Property Map & Buildings</h3>
              <p className="text-xs text-neutral-400">Overview of property layout and building occupancy</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs">
                <Map className="w-4 h-4" />
                <span>Buildings: 5</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs">
                <Clock className="w-4 h-4" />
                <span>Avg Turnover: 6d</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800">
                <MiniPropertyMap />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm">Center on selection</button>
                <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Export map</button>
                <div className="ml-auto text-xs text-neutral-400">Updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="p-3 rounded-lg bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-sky-100"><Building2 className="w-5 h-5 text-sky-600" /></div>
                    <div>
                      <div className="text-sm font-semibold">Occupancy</div>
                      <div className="text-xs text-neutral-400">75% occupied</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">75%</div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-neutral-400">Quick actions</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Create work order</button>
                    <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Notify tenant</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Units status column */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Units</h3>
              <div className="text-xs text-neutral-400">{units.length} units</div>
            </div>

            <UnitList units={units} />

            <div className="mt-4 text-xs text-neutral-500">Tip: click a unit to open details and maintenance history (not implemented in mock).</div>
          </div>
        </div>

        {/* Footer notes */}
        <div className="col-span-12">
          <footer className="mt-4 text-sm text-neutral-400">Design notes: international-standard property overview — integrates with lease, billing and maintenance services. Replace mock data with API hooks (SWR/React Query) for realtime updates.</footer>
        </div>
      </div>
    </section>
  );
}
