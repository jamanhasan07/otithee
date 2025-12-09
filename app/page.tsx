"use client";

import Link from "next/link";
import { ArrowRight, Hotel, Truck, Plane, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 text-slate-900">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-4 sm:px-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-semibold">
            O
          </div>
          <div>
            <p className="text-sm font-semibold">Otithee</p>
            <p className="text-xs text-slate-500">Integrated Hospitality ERP</p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-xs font-medium text-blue-700 hover:text-blue-600"
        >
          Go to dashboard
        </Link>
      </header>

      {/* Hero section */}
      <section className="px-4 pb-16 pt-6 sm:px-10 lg:px-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-center">
          {/* Left: copy */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Otithee Integrated Hospitality Suite
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900">
                Run your entire{" "}
                <span className="text-blue-600">hospitality business</span>{" "}
                from one dashboard.
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
                Otithee connects hotel operations, transport, aviation, property,
                accounting, HR, and training into a single ERP, so your team can
                focus on guests instead of juggling systems.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button asChild className="rounded-xl bg-blue-600 hover:bg-blue-500">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Go to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-xl border-blue-100 bg-white/70"
              >
                <Link href="#modules">Browse modules</Link>
              </Button>

              <p className="text-xs text-slate-500">
                No context switching. One login for every module.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm max-w-md">
              <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-3">
                <p className="font-semibold text-slate-800">Hotels & Resorts</p>
                <p className="mt-1 text-slate-500">
                  Manage rooms, bookings, housekeeping & F&B.
                </p>
              </div>
              <div className="rounded-xl bg-white shadow-sm border border-slate-100 p-3">
                <p className="font-semibold text-slate-800">Finance & HR</p>
                <p className="mt-1 text-slate-500">
                  GL, payroll, invoices & recruitment in one place.
                </p>
              </div>
            </div>
          </div>

          {/* Right: mini module cards */}
          <div
            id="modules"
            className="grid gap-4 sm:gap-5 rounded-3xl bg-white/70 p-4 shadow-xl border border-slate-100"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Key modules
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-500 text-white p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white/20 p-1.5">
                    <Hotel className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Hotel & Resort</span>
                </div>
                <p className="text-xs text-blue-50">
                  Rooms, bookings, housekeeping & F&B.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-white p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white/20 p-1.5">
                    <Truck className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Transport</span>
                </div>
                <p className="text-xs text-sky-50">
                  Fleet, drivers, bookings & tracking.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white/20 p-1.5">
                    <Plane className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Aviation</span>
                </div>
                <p className="text-xs text-indigo-50">
                  Ticketing, visas & compliance.
                </p>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-3 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-white/20 p-1.5">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Property</span>
                </div>
                <p className="text-xs text-emerald-50">
                  Tenants, maintenance & billing.
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Plus City & Resort, Training, Accounting & HR, and Core ERP —
              all available once you enter the dashboard.
            </p>
          </div>
        </div>
      </section>

      <footer className="px-4 pb-6 text-[11px] text-slate-400 sm:px-10">
        © {new Date().getFullYear()} Otithee. All rights reserved.
      </footer>
    </main>
  );
};

export default MainPage;
