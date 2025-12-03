// components/HotelStatusOverviewPremium.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronUp, ChevronDown, Home, DollarSign, CheckSquare, Wrench, Users } from "lucide-react";

/** ---------- utility hooks & small visuals ---------- */

function useCountUp(target: number, duration = 800) {
  const [num, setNum] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const diff = target - from;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setNum(Math.round(from + diff * eased));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return num;
}

function ProgressRing({ value = 0, size = 64, stroke = 8, color = "emerald" }: { value?: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, value)) / 100) * circumference;
  const colorMap: Record<string, string> = {
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    rose: "stroke-rose-500",
    sky: "stroke-sky-500",
    violet: "stroke-violet-500",
    slate: "stroke-slate-400",
  };
  const strokeClass = colorMap[color] ?? colorMap.slate;

  return (
    <svg width={size} height={size} role="img" aria-label={`Progress ${value}%`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={radius} fill="none" stroke="rgba(15,23,42,0.06)" strokeWidth={stroke} />
        <circle
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          className={`${strokeClass} transition-[stroke-dashoffset] duration-500 ease-out`}
          transform="rotate(-90)"
        />
      </g>
    </svg>
  );
}

/**
 * Responsive mini bar sparkline.
 * Uses viewBox + width="100%" so it scales to its container.
 */
function MiniBarSparkline({ points = [], width = 96, height = 40 }: { points?: number[]; width?: number; height?: number }) {
  if (!points || points.length === 0) return null;
  const max = Math.max(...points, 1);
  // compute bar width and total width
  const bw = Math.max(2, Math.floor(width / points.length) - 2);
  const totalWidth = points.length * (bw + 2) + 2;
  return (
    <svg
      width="100%"
      viewBox={`0 0 ${totalWidth} ${height}`}
      height={height}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {points.map((p, i) => {
        const h = Math.round((p / max) * height);
        const x = i * (bw + 2) + 1;
        const y = height - h;
        return <rect key={i} x={x} y={y} width={bw} height={h} rx={2} className="fill-current opacity-85" />;
      })}
    </svg>
  );
}

const textColor = (color?: string) => {
  switch (color) {
    case "emerald":
      return "text-emerald-600";
    case "amber":
      return "text-amber-500";
    case "rose":
      return "text-rose-600";
    case "sky":
      return "text-sky-500";
    case "violet":
      return "text-violet-600";
    default:
      return "text-slate-700";
  }
};

/** ---------- sample data ---------- */
type MetricDatum = {
  id: string;
  title: string;
  value: number;
  suffix?: string;
  change?: number;
  trend?: number[];
  tag?: string;
  color?: string;
  showRing?: boolean;
};

const SAMPLE_DATA: MetricDatum[] = [
  { id: "occupancy", title: "Occupancy", value: 78, suffix: "%", change: 2.4, trend: [65, 70, 72, 75, 78], tag: "Today", color: "emerald", showRing: true },
  { id: "revenue", title: "Revenue (Today)", value: 4210, suffix: "৳", change: 4.8, trend: [3800, 3950, 4050, 4150, 4210], tag: "24h", color: "amber" },
  { id: "housekeeping", title: "Housekeeping Clean %", value: 92, suffix: "%", change: -0.5, trend: [94, 93, 93, 92, 92], tag: "Live", color: "sky" },
  { id: "maintenance", title: "Open Maintenance", value: 6, change: 0, trend: [7, 6, 6, 6, 6], tag: "Open", color: "rose" },
  { id: "checkins", title: "Check-ins Today", value: 14, change: 12, trend: [8, 10, 12, 13, 14], tag: "Today", color: "violet" },
];

/** ---------- main component (fixed layout) ---------- */

export default function HotelStatusOverviewPremium({ data }: { data?: MetricDatum[] }) {
  const metrics = data ?? SAMPLE_DATA;

  const prepared = useMemo(
    () =>
      metrics.map((m) => ({
        ...m,
        changeSign: m.change != null ? (m.change > 0 ? "up" : m.change < 0 ? "down" : "same") : "same",
      })),
    [metrics]
  );

  return (
    <section aria-labelledby="hotel-overview" className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 id="hotel-overview" className="text-2xl font-semibold">
          Hotel & Resort — Live Overview
        </h2>
        <div className="text-sm text-muted-foreground">Updated: just now</div>
      </div>

      {/* grid: add min-w-0 to prevent forcing horizontal overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 min-w-0">
        {prepared.map((m, idx) => {
          const counter = useCountUp(m.value, 900 + idx * 60);
          const isRing = !!m.showRing;
          const iconColorClass = textColor(m.color);

          return (
            <motion.article
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: idx * 0.06 }}
              whileHover={{ y: -6 }}
            >
              {/* Card: vertically fill and space-between so footer sticks to bottom; added overflow-hidden */}
              <Card className="flex flex-col justify-between h-[200px] rounded-2xl bg-white border shadow-sm hover:shadow-md transition overflow-hidden">
                <CardContent className="p-4 min-w-0">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`flex-shrink-0 rounded-md p-2 ${iconColorClass} bg-gray-50`}>
                      {m.id === "occupancy" ? <Home className="w-6 h-6" /> : m.id === "revenue" ? <DollarSign className="w-6 h-6" /> : m.id === "housekeeping" ? <CheckSquare className="w-6 h-6" /> : m.id === "maintenance" ? <Wrench className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium truncate">{m.title}</h3>
                        {m.tag ? <Badge variant="outline" className="text-xs">{m.tag}</Badge> : null}
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        {/* Left block: ring or number (keeps consistent sizing) */}
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="flex items-center justify-center min-w-0">
                            {isRing ? (
                              <div className="w-20 h-20 flex items-center justify-center">
                                <div className="relative" style={{ width: 64, height: 64 }}>
                                  <ProgressRing value={m.value} size={64} stroke={8} color={m.color ?? "emerald"} />
                                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <div className="text-lg font-semibold leading-none">
                                      {counter}
                                      {m.suffix ? <span className="text-xs ml-1">{m.suffix}</span> : null}
                                    </div>
                                    <div className="text-xs text-muted-foreground">of total</div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-2xl font-semibold leading-none">
                                {counter}
                                {m.suffix ? <span className="text-sm ml-1">{m.suffix}</span> : null}
                              </div>
                            )}
                          </div>

                          {/* change badge */}
                          <div className="text-xs min-w-0">
                            <div className="flex items-center gap-1">
                              {m.change != null ? (
                                m.change > 0 ? (
                                  <span className="inline-flex items-center text-emerald-600">
                                    <ChevronUp className="w-3 h-3" /> <span className="ml-0.5">{Math.abs(m.change)}%</span>
                                  </span>
                                ) : m.change < 0 ? (
                                  <span className="inline-flex items-center text-rose-600">
                                    <ChevronDown className="w-3 h-3" /> <span className="ml-0.5">{Math.abs(m.change)}%</span>
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">No change</span>
                                )
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">vs prev period</div>
                          </div>
                        </div>

                        {/* Right block: sparkline (shrink on small screens) */}
                        <div className="ml-auto hidden sm:flex items-center text-muted-foreground min-w-0">
                          <div className="w-[96px] max-w-[20vw]">
                            <div style={{ color: "currentColor" }}>
                              <MiniBarSparkline points={m.trend ?? []} width={96} height={40} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="px-4 py-2">
                  <div className="text-xs text-muted-foreground">Last 24h · Live</div>
                </CardFooter>
              </Card>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
