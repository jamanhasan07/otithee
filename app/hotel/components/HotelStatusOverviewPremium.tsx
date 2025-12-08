"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import Title from "@/app/components/Title";

type Kpi = {
  id: string;
  title: string;
  value: number;
  color: string;
  gradient: string[]; // [startColor, endColor]
  trend: number[];
};

/* ---------- SMALL CHART COMPONENTS ---------- */

function AreaChart({
  points = [],
  color = "#06b6d4",
  height = 64,
}: {
  points?: number[];
  color?: string;
  height?: number;
}) {
  if (!points || points.length === 0) return null;

  const max = Math.max(...points);
  const w = 240;
  const step = w / Math.max(1, points.length - 1);

  const path = points
    .map(
      (p, i) =>
        `${i === 0 ? "M" : "L"} ${i * step} ${height - (p / max) * height}`
    )
    .join(" ");

  const area = `${path} L ${w} ${height} L 0 ${height} Z`;
  const gid = `g_${color.replace("#", "")}`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniBar({
  points = [],
  color = "#10b981",
  height = 40,
}: {
  points?: number[];
  color?: string;
  height?: number;
}) {
  if (!points || points.length === 0) return null;

  const max = Math.max(...points);
  const bw = Math.max(4, Math.floor(96 / points.length) - 2);
  const viewW = points.length * (bw + 4);

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${viewW} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      {points.map((p, i) => {
        const h = Math.round((p / max) * height);
        const x = i * (bw + 4) + 2;
        const y = height - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={bw}
            height={h}
            rx={2}
            fill={color}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}

/* ---------- MAIN COMPONENT ---------- */

export default function HotelStatusOverviewAdobe({ data }: { data?: any }) {
  const metrics: Kpi[] = data ?? [
    {
      id: "new-booking",
      title: "New Booking",
      value: 872,
      color: "#06b6d4",
      gradient: ["#26c6da", "#06b6d4"],
      trend: [60, 70, 80, 72, 87],
    },
    {
      id: "schedule-room",
      title: "Schedule Room",
      value: 285,
      color: "#10b981",
      gradient: ["#34d399", "#10b981"],
      trend: [30, 45, 50, 60, 70],
    },
    {
      id: "check-in",
      title: "Check In",
      value: 53,
      color: "#f97316",
      gradient: ["#f6ad55", "#f97316"],
      trend: [10, 20, 30, 45, 53],
    },
    {
      id: "check-out",
      title: "Check Out",
      value: 78,
      color: "#fb7185",
      gradient: ["#fb7185", "#ef4444"],
      trend: [20, 30, 40, 55, 78],
    },
  ];

  const stats = {
    totalSales: {
      value: 230816,
      color: "#06b6d4",
      points: [40, 60, 50, 70, 60, 80],
    },
    newCustomers: {
      value: 2542,
      color: "#10b981",
      points: [10, 30, 20, 40, 60, 50],
    },
  };

  const housekeepingRows = [
    {
      name: "Mike",
      summary: "Text here",
      completion: 50,
      overdue: 2,
      bars: [7, 1, 3],
      happy: 1,
    },
    {
      name: "Ashton",
      summary: "Text here",
      completion: 20,
      overdue: 8,
      bars: [3, 12, 4],
      happy: 0,
    },
    {
      name: "Devon",
      summary: "Text here",
      completion: 0,
      overdue: 11,
      bars: [10, 0, 0],
      happy: 1,
    },
    {
      name: "Bill",
      summary: "Text here",
      completion: 40,
      overdue: 3,
      bars: [5, 6, 2],
      happy: 2,
    },
    {
      name: "James",
      summary: "Text here",
      completion: 0,
      overdue: 0,
      bars: [0, 0, 0],
      happy: 0,
    },
  ];

  return (
    <div className="text-slate-900">
      <div className="  px-4 sm:px-6 lg:px-0 space-y-6">
        <Title
          title="Hotel & Resort"
          subTitle="Rooms, bookings, housekeeping, and F&B operations — all in one place."
        />

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((kpi) => (
            <div
              key={kpi.id}
              className="rounded-2xl p-5 text-white shadow-lg"
              style={{
                background: `linear-gradient(90deg, ${kpi.gradient[0]}, ${kpi.gradient[1]})`,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{kpi.value}</div>
                  <div className="text-sm opacity-90">{kpi.title}</div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <DollarSign />
                </div>
              </div>
              <div className="mt-4 h-16">
                <AreaChart points={kpi.trend} color={kpi.color} height={40} />
              </div>
            </div>
          ))}
        </div>

        {/* Main grid: charts + booking + schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl p-6 bg-white shadow">
              {/* Totals */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <div>
                  <div className="text-sm text-slate-400">Total Sales</div>
                  <div className="text-2xl font-semibold">
                    {stats.totalSales.value.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-slate-400">New Customers</div>
                  <div className="text-xl font-semibold">
                    {stats.newCustomers.value.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className="col-span-1 md:col-span-2 p-4 rounded-lg"
                  style={{
                    background: "linear-gradient(180deg,#f8feff,#ffffff)",
                  }}
                >
                  <div className="text-sm text-slate-400 mb-2">
                    Occupancy Trend
                  </div>
                  <div className="h-40">
                    <AreaChart
                      points={stats.totalSales.points}
                      color={stats.totalSales.color}
                      height={120}
                    />
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg overflow-hidden"
                  style={{
                    background: "linear-gradient(180deg,#fff7f0,#ffffff)",
                  }}
                >
                  <div className="text-sm text-slate-400 mb-2">
                    Revenue Breakdown
                  </div>
                  <div className="h-40">
                    <MiniBar
                      points={[30, 20, 40, 25, 50, 35]}
                      color="#fb7185"
                      height={120}
                    />
                  </div>
                </div>
              </div>

              {/* Booking list */}
              <div className="mt-6">
                <div className="text-sm text-slate-500 mb-3 font-medium">
                  Booking list
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-xs text-slate-500">
                      <tr>
                        <th className="py-3 text-left px-4">#</th>
                        <th className="py-3 text-left">Guest</th>
                        <th className="py-3 text-left">Type of Room</th>
                        <th className="py-3 text-left">Check In</th>
                        <th className="py-3 text-left">Check out</th>
                        <th className="py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t">
                        <td className="py-3 px-4">1</td>
                        <td>Jordy Astaws</td>
                        <td>Double Room</td>
                        <td>01/09/24</td>
                        <td>02/10/24</td>
                        <td>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 px-4">2</td>
                        <td>Alisa Oon</td>
                        <td>Double Room</td>
                        <td>28/09/24</td>
                        <td>01/10/24</td>
                        <td>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t">
                        <td className="py-3 px-4">3</td>
                        <td>Brigette Guerra</td>
                        <td>Double Room</td>
                        <td>23/10/24</td>
                        <td>22/11/24</td>
                        <td>
                          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                            Pending
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="rounded-2xl p-4 bg-white shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Upcoming schedule</h4>
                <div className="text-xs text-slate-400">This month</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="grid grid-cols-7 gap-2 text-xs text-slate-400">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
                    <div key={d} className="text-center py-2">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-sm text-slate-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 mr-2">
                    11
                  </span>
                  Review Manual Checkin
                  <div className="text-xs text-slate-400">10:30 am</div>
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 mr-2">
                    20
                  </span>
                  Meeting with Supervisor
                  <div className="text-xs text-slate-400">11:00 am</div>
                </div>
              </div>
            </Card>

            <Card className="rounded-2xl p-4 bg-white shadow">
              <h4 className="text-sm font-medium">Today is Revenue</h4>
              <div className="text-2xl font-semibold mt-2">৳ 123,890</div>
              <div className="mt-2 text-xs text-slate-400">vs yesterday</div>
            </Card>
          </div>
        </div>

        {/* Housekeeping card */}
        <Card className="rounded-2xl p-4 bg-white shadow w-full">
          <h3 className="text-lg font-semibold mb-3">
            Housekeeping — Progress, Plans & Problems
          </h3>

          {/* Rings row */}
          <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-4">
            {[
              { label: "Happiness", value: 4, color: "#0ea5e9" },
              { label: "Completion", value: 75, color: "#10b981" },
              { label: "Overdue", value: 5, color: "#f59e0b" },
              { label: "Problems", value: 3, color: "#fb7185" },
            ].map((k, i) => (
              <div
                key={i}
                className="flex-1 p-3 bg-[#fbfcfd] rounded-lg flex items-center justify-center"
              >
                <div className="flex items-center gap-3">
                  <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden>
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke="#eef2f7"
                      strokeWidth="6"
                      fill="none"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      stroke={k.color}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(Math.PI * 2 * 26 * k.value) / 100} ${
                        Math.PI * 2 * 26
                      }`}
                      transform="rotate(-90 32 32)"
                      fill="none"
                    />
                    <text
                      x="32"
                      y="34"
                      textAnchor="middle"
                      fontSize="14"
                      className="font-semibold text-slate-700"
                    >
                      {k.value}
                      {k.label === "Completion" ? "%" : ""}
                    </text>
                  </svg>
                  <div className="text-sm text-slate-600">{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Housekeeping table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="text-xs text-slate-500">
                <tr>
                  <th className="py-2 text-left px-4">Name</th>
                  <th className="py-2 text-left">Summary</th>
                  <th className="py-2 text-left">Completion</th>
                  <th className="py-2 text-left">Overdue</th>
                  <th className="py-2 text-left">
                    Progress / Plans / Problems
                  </th>
                  <th className="py-2 text-left">Happiness</th>
                </tr>
              </thead>
              <tbody>
                {housekeepingRows.map((r, idx) => {
                  const totalBars = r.bars.reduce((a, b) => a + b, 0);
                  return (
                    <tr
                      key={idx}
                      className={`border-t ${
                        idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                    >
                      <td className="py-3 px-4 align-top">{r.name}</td>
                      <td className="py-3 align-top">{r.summary}</td>
                      <td className="py-3 align-top text-blue-600 font-semibold">
                        {r.completion ? `${r.completion}%` : "-"}
                      </td>
                      <td className="py-3 align-top text-amber-600">
                        {r.overdue || "-"}
                      </td>
                      <td className="py-3 align-top">
                        <div className="w-full bg-slate-100 h-6 rounded overflow-hidden flex">
                          {totalBars > 0 ? (
                            <>
                              <div
                                style={{
                                  width: `${(r.bars[0] / totalBars) * 100}%`,
                                }}
                                className="bg-blue-600 text-white text-xs flex items-center justify-center"
                              >
                                {r.bars[0]}
                              </div>
                              <div
                                style={{
                                  width: `${(r.bars[1] / totalBars) * 100}%`,
                                }}
                                className="bg-emerald-500 text-white text-xs flex items-center justify-center"
                              >
                                {r.bars[1] || ""}
                              </div>
                              <div
                                style={{
                                  width: `${(r.bars[2] / totalBars) * 100}%`,
                                }}
                                className="bg-amber-500 text-white text-xs flex items-center justify-center"
                              >
                                {r.bars[2] || ""}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-400 px-2">-</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 align-top text-center">
                        {r.happy === 2 ? (
                          <span className="text-amber-400">★</span>
                        ) : r.happy === 1 ? (
                          <span className="text-amber-400">☆</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
