"use client";

import React from "react";
import { Boxes, ShoppingCart, Building2, Wrench, Users, FileText, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import Title from "@/app/components/Title";

// CoreERPOverview — international-standard layout matching your other overview pages
// - KPI cards: Inventory Value, Active POs, Open Work Orders
// - Procurement snapshot, Asset register preview, Maintenance queue
// - Vendor performance and quick actions
// - Ready to wire to real APIs (SWR / React Query)

type Kpi = { id: string; title: string; subtitle?: string; value: string | number; accent: "blue" | "green" | "yellow" | "purple" | "pink"; icon?: React.ReactNode; sparkline?: number[] };

type PO = { id: string; ref: string; vendor: string; amount: string; status: "open" | "received" | "closed" };
type Asset = { id: string; tag: string; location: string; value: number; status: "active" | "decommissioned" };
type WorkOrder = { id: string; title: string; priority: "low" | "medium" | "high"; assignee?: string };

function Sparkline({ data = [] }: { data?: number[] }) {
  if (!data || data.length === 0) return null;
  const w = 80;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const normalize = (v: number) => (max === min ? h / 2 : h - ((v - min) / (max - min)) * h);
  const path = data.map((d, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * w} ${normalize(d)}`).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  const accentMap: Record<string, { ring: string; text: string; border: string }> = {
    blue: { ring: "from-sky-100 to-sky-200", text: "text-sky-500", border: "border-sky-100" },
    green: { ring: "from-emerald-100 to-emerald-200", text: "text-emerald-500", border: "border-emerald-100" },
    yellow: { ring: "from-amber-100 to-amber-200", text: "text-amber-500", border: "border-amber-100" },
    purple: { ring: "from-violet-100 to-violet-200", text: "text-violet-500", border: "border-violet-100" },
    pink: { ring: "from-pink-100 to-pink-200", text: "text-pink-500", border: "border-pink-100" },
  };
  const ac = accentMap[kpi.accent];
  return (
    <motion.article whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 280 }} className={`bg-white/95 dark:bg-neutral-900/80 border ${ac.border} p-4 rounded-2xl shadow-md`} role="region" aria-label={kpi.title}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${ac.ring} bg-opacity-40`}>{kpi.icon}</div>
          <div>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">{kpi.title}</div>
            {kpi.subtitle && <div className="text-xs text-neutral-400">{kpi.subtitle}</div>}
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className={`text-2xl font-extrabold ${ac.text}`}>{kpi.value}</div>
          {kpi.sparkline && <div className="text-neutral-400 w-24"><Sparkline data={kpi.sparkline} /></div>}
        </div>
      </div>
    </motion.article>
  );
}

function PORow({ p }: { p: PO }) {
  const statusClass = p.status === "open" ? "bg-amber-100 text-amber-700" : p.status === "received" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700";
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{p.ref} — {p.vendor}</div>
        <div className="text-xs text-neutral-400">{p.amount}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>{p.status}</div>
      </div>
    </div>
  );
}

function AssetRow({ a }: { a: Asset }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{a.tag} • {a.location}</div>
        <div className="text-xs text-neutral-400">Status: {a.status}</div>
      </div>
      <div className="text-sm font-medium">${a.value.toLocaleString()}</div>
    </div>
  );
}

function WorkOrderRow({ w }: { w: WorkOrder }) {
  const pri = w.priority === "high" ? "text-rose-600" : w.priority === "medium" ? "text-amber-600" : "text-slate-600";
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{w.title}</div>
        <div className="text-xs text-neutral-400">Assignee: {w.assignee ?? "—"}</div>
      </div>
      <div className={`text-sm font-medium ${pri}`}>{w.priority}</div>
    </div>
  );
}

export default function CoreERPOverview() {
  const kpis: Kpi[] = [
    { id: "inventory_value", title: "Inventory Value", subtitle: "Current stock", value: "$1,254,320", accent: "blue", icon: <Boxes className="w-5 h-5" />, sparkline: [1100, 1120, 1150, 1180, 1200, 1220, 1254] },
    { id: "active_pos", title: "Active POs", subtitle: "Open purchase orders", value: 24, accent: "green", icon: <ShoppingCart className="w-5 h-5" />, sparkline: [18, 20, 21, 22, 23, 23, 24] },
    { id: "open_wos", title: "Open Work Orders", subtitle: "Maintenance queue", value: 12, accent: "yellow", icon: <Wrench className="w-5 h-5" />, sparkline: [8, 9, 10, 11, 12, 12, 12] },
  ];

  const pos: PO[] = [
    { id: "p1", ref: "PO-4501", vendor: "SupplyCo", amount: "$24,500", status: "open" },
    { id: "p2", ref: "PO-4500", vendor: "PartsRUs", amount: "$5,200", status: "received" },
    { id: "p3", ref: "PO-4499", vendor: "FuelCorp", amount: "$12,000", status: "open" },
  ];

  const assets: Asset[] = [
    { id: "a1", tag: "AS-1001", location: "Warehouse A", value: 12000, status: "active" },
    { id: "a2", tag: "AS-1002", location: "Building B", value: 45000, status: "active" },
    { id: "a3", tag: "AS-1003", location: "Site C", value: 8000, status: "decommissioned" },
  ];

  const wos: WorkOrder[] = [
    { id: "w1", title: "Conveyor belt repair", priority: "high", assignee: "Tech A" },
    { id: "w2", title: "HVAC filter replacement", priority: "medium", assignee: "Tech B" },
    { id: "w3", title: "Forklift inspection", priority: "low" },
  ];

  const vendors = [
    { id: "v1", name: "SupplyCo", score: "A+", outstanding: "$5,200" },
    { id: "v2", name: "PartsRUs", score: "A", outstanding: "$0" },
  ];

  return (
    <section className="p-4">
      <header className="flex items-center justify-between mb-4">
      <Title
  title="Core ERP"
  subTitle="Roles, permissions, integrations, workflows, and API controls."
/>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-4">
        {/* KPI row */}
        {kpis.map((k) => (
          <div key={k.id} className="col-span-12 sm:col-span-4">
            <KpiCard kpi={k} />
          </div>
        ))}

        {/* Main area: Procurement & Inventory */}
        <motion.div whileHover={{ y: -6 }} className="col-span-12 lg:col-span-8 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Procurement Snapshot</h3>
              <p className="text-xs text-neutral-400">Open POs, expected receipts and spend</p>
            </div>
            <div className="text-xs text-neutral-400">Updated: {new Date().toLocaleTimeString()}</div>
          </div>

          <div className="mt-4 space-y-3">
            {pos.map((p) => (
              <PORow key={p.id} p={p} />
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Inventory Highlights</h4>
            <div className="rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 p-3 bg-gradient-to-tr from-sky-50 to-white">
              <div className="text-sm text-neutral-600">Top stocked SKUs and low-stock alerts (placeholder)</div>
            </div>
          </div>
        </motion.div>

        {/* Right column: Assets & Maintenance */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Assets</h3>
                <div className="text-xs text-neutral-400">Top assets</div>
              </div>

              <div className="mt-3 space-y-2">
                {assets.map((a) => (
                  <AssetRow key={a.id} a={a} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Maintenance Queue</h3>
                <div className="text-xs text-neutral-400">{wos.length} open</div>
              </div>

              <div className="mt-3 space-y-2">
                {wos.map((w) => (
                  <WorkOrderRow key={w.id} w={w} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Vendors</h3>
                <div className="text-xs text-neutral-400">Performance</div>
              </div>

              <div className="mt-3 space-y-2">
                {vendors.map((v) => (
                  <div key={v.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
                    <div>
                      <div className="text-sm font-semibold">{v.name}</div>
                      <div className="text-xs text-neutral-400">Score: {v.score}</div>
                    </div>
                    <div className="text-sm font-medium">{v.outstanding}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-neutral-400">Tip: connect procurement and inventory feeds to keep PO and stock status realtime.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-12">
          <footer className="mt-4 text-sm text-neutral-400">Design notes: Core ERP overview — add charts for spend and asset depreciation, connect to procurement APIs for live PO status.</footer>
        </div>
      </div>
    </section>
  );
}
