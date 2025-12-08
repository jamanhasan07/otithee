"use client";

import React from "react";
import {
  Truck,
  Users,
  Calendar,
  Layers,
  ChevronRight,
  MapPin,
  Clock,
  Route,
  Wifi,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import Title from "@/app/components/Title";


// Transport-focused, unique dashboard layout
// - Row 1: 3 compact KPI cards (col-span 4 each)
// - Row 2: Large map/route card (col-span 8) + Vehicles status card (col-span 4)
// - Transport-specific visuals: mini route map (SVG), ETA chip, connection status
// - Keepable: replace mock data with real API hooks (SWR/React Query)

type StatCardProps = {
  title: string;
  subtitle?: string;
  value: string | number;
  accent: "blue" | "green" | "yellow" | "purple" | "pink";
  icon?: React.ReactNode;
  sparkline?: number[];
  ariaLabel?: string;
};

// add id for list keys
type StatItem = StatCardProps & { id: string };

function getAccentClasses(accent: StatCardProps["accent"]) {
  switch (accent) {
    case "green":
      return {
        ring: "from-emerald-100 to-emerald-200",
        text: "text-emerald-500",
        border: "border-emerald-100",
      };
    case "yellow":
      return {
        ring: "from-amber-100 to-amber-200",
        text: "text-amber-500",
        border: "border-amber-100",
      };
    case "purple":
      return {
        ring: "from-violet-100 to-violet-200",
        text: "text-violet-500",
        border: "border-violet-100",
      };
    case "pink":
      return {
        ring: "from-pink-100 to-pink-200",
        text: "text-pink-500",
        border: "border-pink-100",
      };
    default:
      return {
        ring: "from-sky-100 to-sky-200",
        text: "text-sky-500",
        border: "border-sky-100",
      };
  }
}

function Sparkline({ data = [] }: { data?: number[] }) {
  if (!data || data.length === 0) return null;
  const w = 72;
  const h = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const normalize = (v: number) =>
    max === min ? h / 2 : h - ((v - min) / (max - min)) * h;
  const path = data
    .map(
      (d, i) =>
        `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * w} ${normalize(d)}`
    )
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatCard({
  title,
  subtitle,
  value,
  accent,
  icon,
  sparkline,
  ariaLabel,
}: StatCardProps) {
  const accentClasses = getAccentClasses(accent);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className={`relative bg-gradient-to-br from-white/90 to-white/80 dark:from-neutral-900/80 dark:to-neutral-900/70 border ${accentClasses.border} p-4 rounded-2xl shadow-lg`}
      role="region"
      aria-label={ariaLabel ?? title}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`p-3 rounded-lg bg-gradient-to-br ${accentClasses.ring} bg-opacity-40`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className={`text-2xl font-extrabold ${accentClasses.text}`}>
            {value}
          </div>
          {sparkline && (
            <div className="text-neutral-400 w-20">
              <Sparkline data={sparkline} />
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function MiniRouteMap() {
  // Simple stylized SVG representing a route — replace with real map later
  return (
    <svg
      viewBox="0 0 200 120"
      preserveAspectRatio="none"
      className="w-full h-44 rounded-lg overflow-hidden"
    >
      <defs>
        <linearGradient id="gRoute" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="#0f172a0f" />
      <path
        d="M12 96 C48 68, 84 40, 120 48 C150 56, 170 80, 188 24"
        fill="none"
        stroke="url(#gRoute)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="96" r="6" fill="#06b6d4" />
      <circle cx="188" cy="24" r="6" fill="#60a5fa" />
    </svg>
  );
}

function VehiclesList({
  vehicles,
}: {
  vehicles: Array<{
    id: string;
    status: "active" | "idle" | "maintenance";
    eta?: number | null;
    route?: string;
  }>;
}) {
  return (
    <div className="space-y-3">
      {vehicles.map((v) => (
        <div
          key={v.id}
          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
              <Truck className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <div className="text-sm font-semibold">Vehicle {v.id}</div>
              <div className="text-xs text-neutral-400">{v.route ?? "No route"}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`text-xs px-2 py-1 rounded-full ${
                v.status === "active"
                  ? "bg-emerald-100 text-emerald-700"
                  : v.status === "idle"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-neutral-100 text-neutral-700"
              }`}
            >
              {v.status}
            </div>
            <div className="text-xs text-neutral-500">ETA: {v.eta ? `${v.eta} min` : "—"}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TransportsOverviewPremium() {
  // sample/mock data for demo — explicitly typed
  const stats: StatItem[] = [
    {
      id: "active",
      title: "Active Rides",
      subtitle: "Live now",
      value: 12,
      accent: "blue",
      icon: <Truck className="w-5 h-5 text-current" />,
      sparkline: [10, 24, 18, 30, 26, 34, 28],
    },
    {
      id: "bookings",
      title: "Bookings Today",
      subtitle: "24h",
      value: 134,
      accent: "green",
      icon: <Calendar className="w-5 h-5 text-current" />,
      sparkline: [32, 48, 76, 56, 90, 110, 134],
    },
    {
      id: "drivers",
      title: "Drivers Online",
      subtitle: "Available",
      value: 18,
      accent: "yellow",
      icon: <Users className="w-5 h-5 text-current" />,
      sparkline: [8, 12, 10, 14, 16, 18, 18],
    },
  ];

  const vehicles: Array<{ id: string; status: "active" | "idle" | "maintenance"; eta?: number | null; route?: string }> = [
    { id: "A12", status: "active", eta: 6, route: "City Center → Airport" },
    { id: "B34", status: "idle", eta: null, route: "Standby" },
    { id: "C56", status: "maintenance", eta: null, route: "Garage" },
  ];

  return (
    <section className="p-4">
      <header className="flex items-center justify-between mb-4">
      <Title
  title="Transport"
  subTitle="Manage fleet, drivers, bookings, dispatching, and real-time tracking."
/>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        {/* Row 1: three compact KPIs */}
        {stats.map((s) => (
          <div key={s.id} className="col-span-12 sm:col-span-4">
            <StatCard {...s} />
          </div>
        ))}

        {/* Row 2: large map/route card + vehicles list */}
        <motion.div
          whileHover={{ y: -6 }}
          className="col-span-12 lg:col-span-8 p-4 rounded-2xl bg-white/90 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-lg"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Live Routes</h3>
              <p className="text-xs text-neutral-400">Quick glance of ongoing routes and ETA</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs">
                <MapPin className="w-4 h-4" />
                <span>Active: {vehicles.filter((v) => v.status === "active").length}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs">
                <Clock className="w-4 h-4" />
                <span>Avg ETA: 8m</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800">
                <MiniRouteMap />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm">Center on fleet</button>
                <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Export route</button>
                <div className="ml-auto text-xs text-neutral-400">Updated: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="p-3 rounded-lg bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 h-full">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-sky-100">
                      <Truck className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Fleet Util.</div>
                      <div className="text-xs text-neutral-400">72% utilized</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-700">72%</div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-neutral-400">Connection</div>
                  <div className="mt-2 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-emerald-500" />
                    <div className="text-sm">Good ({vehicles.length} vehicles)</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs text-neutral-400">Quick actions</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Dispatch nearest</button>
                    <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Send broadcast</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Vehicles status column */}
        <div className="col-span-12 lg:col-span-4 ">
          <div className="p-4 rounded-2xl h-full bg-white/90 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Vehicles</h3>
              <div className="text-xs text-neutral-400">{vehicles.length} items</div>
            </div>

            <VehiclesList vehicles={vehicles} />

            <div className="mt-4 text-xs text-neutral-500">Tip: click a vehicle to view live route (not implemented in mock).</div>
          </div>
        </div>
      </div>
    </section>
  );
}
