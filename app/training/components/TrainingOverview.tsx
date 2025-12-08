"use client";

import React from "react";
import { BookOpen, Users, CalendarDays, ClipboardList, BarChart2, RefreshCw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

// TrainingOverview — international-standard layout matching other overview pages
// - KPI cards
// - Courses list with progress
// - Upcoming sessions calendar placeholder
// - Trainee leaderboard and exam center
// - Ready to connect to APIs (SWR / React Query)

type Kpi = { id: string; title: string; subtitle?: string; value: string | number; accent: "blue" | "green" | "yellow" | "purple" | "pink"; icon?: React.ReactNode; sparkline?: number[] };

type Course = { id: string; title: string; lessons: number; enrolled: number; progress: number };
type Session = { id: string; title: string; date: string; time: string; venue?: string };

type Trainee = { id: string; name: string; completed: number; score?: number };

function Sparkline({ data = [] }: { data?: number[] }) {
  if (!data || data.length === 0) return null;
  const w = 72;
  const h = 24;
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
          {kpi.sparkline && <div className="text-neutral-400 w-20"><Sparkline data={kpi.sparkline} /></div>}
        </div>
      </div>
    </motion.article>
  );
}

function CourseRow({ c }: { c: Course }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{c.title}</div>
        <div className="text-xs text-neutral-400">{c.lessons} lessons • {c.enrolled} enrolled</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-24 text-right text-sm font-medium">{c.progress}%</div>
        <div className="w-20 bg-neutral-100 rounded-full overflow-hidden h-2">
          <div style={{ width: `${c.progress}%` }} className="h-2 bg-sky-600" />
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400" />
      </div>
    </div>
  );
}

function SessionItem({ s }: { s: Session }) {
  return (
    <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold">{s.title}</div>
          <div className="text-xs text-neutral-400">{s.venue ?? "Online"}</div>
        </div>
        <div className="text-xs text-neutral-500">{s.date} • {s.time}</div>
      </div>
    </div>
  );
}

function TraineeRow({ t }: { t: Trainee }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
      <div>
        <div className="text-sm font-semibold">{t.name}</div>
        <div className="text-xs text-neutral-400">Completed: {t.completed} courses</div>
      </div>
      <div className="text-sm font-medium text-slate-700">{t.score ?? "—"}</div>
    </div>
  );
}

export default function TrainingOverview() {
  const kpis: Kpi[] = [
    { id: "courses", title: "Active Courses", subtitle: "Published", value: 42, accent: "blue", icon: <BookOpen className="w-5 h-5" />, sparkline: [28, 30, 32, 34, 36, 40, 42] },
    { id: "learners", title: "Active Learners", subtitle: "This month", value: 1_284, accent: "green", icon: <Users className="w-5 h-5" />, sparkline: [800, 900, 1000, 1100, 1200, 1250, 1284] },
    { id: "completions", title: "Completions", subtitle: "Last 30 days", value: 312, accent: "purple", icon: <ClipboardList className="w-5 h-5" />, sparkline: [120, 150, 180, 200, 240, 280, 312] },
  ];

  const courses: Course[] = [
    { id: "c1", title: "Next.js for Developers", lessons: 12, enrolled: 420, progress: 72 },
    { id: "c2", title: "React Advanced Patterns", lessons: 10, enrolled: 310, progress: 58 },
    { id: "c3", title: "MERN Stack Bootcamp", lessons: 20, enrolled: 220, progress: 41 },
  ];

  const sessions: Session[] = [
    { id: "s1", title: "React Workshop", date: "Dec 21, 2025", time: "10:00 AM", venue: "Room A" },
    { id: "s2", title: "Testing with Jest", date: "Dec 23, 2025", time: "2:00 PM", venue: "Online" },
    { id: "s3", title: "Design Systems", date: "Jan 05, 2026", time: "11:00 AM", venue: "Room B" },
  ];

  const trainees: Trainee[] = [
    { id: "t1", name: "Aisha Khan", completed: 8, score: 96 },
    { id: "t2", name: "Liam Smith", completed: 6, score: 92 },
    { id: "t3", name: "Sofia Perez", completed: 5, score: 89 },
  ];

  return (
    <section className="p-4">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Training Overview</h1>
          <p className="text-sm text-neutral-500">Courses, sessions, trainees and certification activity</p>
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

        {/* Main area: Courses list + sessions */}
        <motion.div whileHover={{ y: -6 }} className="col-span-12 lg:col-span-8 p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold">Courses</h3>
              <p className="text-xs text-neutral-400">Active courses and progress</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-neutral-400">{courses.length} courses</div>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {courses.map((c) => (
              <CourseRow key={c.id} c={c} />
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-2">Upcoming Sessions</h4>
            <div className="space-y-3">
              {sessions.map((s) => (
                <SessionItem key={s.id} s={s} />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right column: Trainees & Exams */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-4 rounded-2xl bg-white/95 dark:bg-neutral-900/75 border border-neutral-200 dark:border-neutral-800 shadow-md space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Top Trainees</h3>
                <div className="text-xs text-neutral-400">Leaderboard</div>
              </div>

              <div className="mt-3 space-y-2">
                {trainees.map((t) => (
                  <TraineeRow key={t.id} t={t} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exam Center</h3>
                <div className="text-xs text-neutral-400">Assessments</div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Pending Grading</div>
                      <div className="text-xs text-neutral-400">12 submissions</div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">Action</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/70">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold">Certification Issued</div>
                      <div className="text-xs text-neutral-400">24 last month</div>
                    </div>
                    <div className="text-sm font-medium text-slate-700">View</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-neutral-400">Tip: connect with your LMS or add SCORM/xAPI feeds for richer analytics.</div>
          </div>
        </div>

        {/* Footer */}
        <div className="col-span-12">
          <footer className="mt-4 text-sm text-neutral-400">Design notes: training overview — replace mock data with course and session APIs. Add enrollment and certification flows as next steps.</footer>
        </div>
      </div>
    </section>
  );
}
