"use client";

import React from "react";
import { FileText, Wallet, BarChart2, Calendar, Clock, RefreshCw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// AccountingOverview — international-standard layout matching other overview pages
// - KPI cards (Revenue, Receivables, Payables)
// - Recent invoices / payments list
// - Mini revenue sparkline and GL snapshot
// - Ready to replace mocks with real APIs (SWR / React Query)

type Kpi = { id: string; title: string; subtitle?: string; value: string | number; accent: "blue" | "green" | "yellow" | "purple" | "pink"; icon?: React.ReactNode; sparkline?: number[] };

type Invoice = { id: string; ref: string; customer: string; amount: string; status: "paid" | "unpaid" | "overdue"; due?: string };

type Ledger = { id: string; account: string; balance: number };

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
      <path d={path} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
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

function InvoiceRow({ inv }: { inv: Invoice }) {
  const statusColor = inv.status === "paid" ? "bg-emerald-100 text-emerald-700" : inv.status === "unpaid" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700";
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{inv.ref} — {inv.customer}</div>
        <div className="text-xs text-neutral-400">Due: {inv.due ?? "—"}</div>
      </div>
      <div className="flex items-center gap-3">
        <div className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>{inv.status}</div>
        <div className="text-sm font-medium">{inv.amount}</div>
      </div>
    </div>
  );
}

export default function AccountingOverview() {
  const kpis: Kpi[] = [
    { id: "revenue", title: "Revenue (MTD)", subtitle: "Month to date", value: "$184,320", accent: "blue", icon: <BarChart2 className="w-5 h-5" />, sparkline: [120, 130, 140, 160, 170, 180, 184] },
    { id: "receivable", title: "Accounts Receivable", subtitle: "Outstanding", value: "$28,430", accent: "yellow", icon: <FileText className="w-5 h-5" />, sparkline: [30, 32, 31, 30, 29, 28, 28] },
    { id: "payable", title: "Accounts Payable", subtitle: "Due soon", value: "$12,900", accent: "purple", icon: <Wallet className="w-5 h-5" />, sparkline: [10, 11, 12, 13, 13, 12, 12] },
  ];

  const invoices: Invoice[] = [
    { id: "i1", ref: "INV-1023", customer: "Acme Corp", amount: "$3,200", status: "unpaid", due: "2025-12-20" },
    { id: "i2", ref: "INV-1024", customer: "Skyline Ltd.", amount: "$1,200", status: "paid", due: "2025-12-01" },
    { id: "i3", ref: "INV-1025", customer: "Harbor Inc.", amount: "$8,000", status: "overdue", due: "2025-11-28" },
  ];

  const ledger: Ledger[] = [
    { id: "l1", account: "Cash & Bank", balance: 120_340 },
    { id: "l2", account: "Inventory", balance: 54_200 },
    { id: "l3", account: "Accounts Receivable", balance: 28_430 },
  ];

  return (
    <section className="p-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Accounting Overview</h1>
          <p className="text-sm text-neutral-500">Financial snapshot — revenue, AR/AP and recent invoices</p>
        </div>
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

        {/* Main area: Revenue chart & invoices */}
        <motion.div whileHover={{ y: -6 }} className="col-span-12 lg:col-span-8 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Revenue Trend</h3>
              <p className="text-xs text-neutral-400">Month-to-date revenue and recent activity</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-neutral-400">
              <div>Period: MTD</div>
              <div>|</div>
              <div>Currency: USD</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden border border-neutral-100 dark:border-neutral-800 p-4">
                {/* Placeholder for a larger revenue chart; keep visual consistent */}
                <div className="w-full h-44 bg-gradient-to-tr from-sky-50 to-white rounded-lg flex items-center justify-center text-neutral-300">Revenue chart placeholder</div>

                <div className="mt-3 flex items-center gap-3">
                  <button className="px-3 py-2 rounded-md bg-sky-600 text-white text-sm">Export CSV</button>
                  <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">View report</button>
                  <div className="ml-auto text-xs text-neutral-400">Updated: {new Date().toLocaleTimeString()}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="p-3 rounded-lg bg-white/80 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">GL Snapshot</div>
                  <div className="text-xs text-neutral-400">Key accounts</div>
                </div>

                <div className="mt-3 space-y-2">
                  {ledger.map((l) => (
                    <div key={l.id} className="flex items-center justify-between text-sm">
                      <div>{l.account}</div>
                      <div className="font-medium text-slate-700">${l.balance.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Recent Invoices</h4>
            <div className="space-y-2">
              {invoices.map((inv) => (
                <InvoiceRow key={inv.id} inv={inv} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column: Payables & quick actions */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Payables</h3>
                <div className="text-xs text-neutral-400">Due soon</div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
                  <div>
                    <div className="text-sm font-semibold">Vendor: SupplyCo</div>
                    <div className="text-xs text-neutral-400">Due: 2025-12-21</div>
                  </div>
                  <div className="text-sm font-medium">$4,200</div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
                  <div>
                    <div className="text-sm font-semibold">Vendor: FuelCorp</div>
                    <div className="text-xs text-neutral-400">Due: 2025-12-24</div>
                  </div>
                  <div className="text-sm font-medium">$2,100</div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Quick Actions</h3>
                <div className="text-xs text-neutral-400">Utilities</div>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm">Create Invoice</button>
                <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Record Payment</button>
                <button className="px-3 py-2 rounded-md border border-neutral-200 text-sm">Run Reconciliation</button>
              </div>
            </div>

            <div className="text-xs text-neutral-400">Tip: connect bank feeds and automate reconciliation (Plaid / Yodlee).</div>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-12">
          <footer className="mt-4 text-sm text-neutral-400">Design notes: accounting overview — integrate with GL and billing APIs, add charts and drilldowns for detailed analysis.</footer>
        </div>
      </div>
    </section>
  );
}
