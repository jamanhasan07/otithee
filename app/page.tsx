"use client";

import Link from "next/link";
import { ArrowRight, Hotel, Truck, Plane, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainPage = () => {
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 text-slate-800 flex flex-col">
      {/* Banner */}
      <section className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-4xl rounded-3xl bg-white border border-slate-200 shadow-xl px-6 py-8 sm:px-10 sm:py-10">
          {/* Top row: logo + dashboard */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-semibold">
                O
              </div>
              <div>
                <p className="text-sm font-semibold">Otithee</p>
                <p className="text-[11px] text-slate-500">
                  Integrated Hospitality ERP
                </p>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="hidden sm:flex h-8 rounded-full border-slate-300 bg-white/70 text-xs"
            >
              <Link href="/dashboard">
                Go to dashboard
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>

          {/* Hero text */}
          <div className="space-y-4">
            <p className="inline-flex items-center rounded-full bg-blue-100 text-blue-600 px-3 py-1 text-[11px] font-medium">
              Unified control for your hospitality business
            </p>

            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              One simple dashboard for hotels, transport, aviation & more.
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-slate-600 leading-relaxed">
              Manage your entire hospitality workflow in one place — no
              switching tabs, no juggling systems.
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              asChild
              className="rounded-full bg-blue-600 hover:bg-blue-500 px-4 text-xs sm:text-sm text-white"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Enter dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="text-[11px] text-slate-500">
              One login. All modules.
            </p>
          </div>

          {/* Mini module badges */}
          <div className="mt-7 flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">
              Included modules:
            </span>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 border border-blue-100">
                <Hotel className="h-3 w-3" />
                Hotels
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 text-cyan-700 px-2.5 py-1 border border-cyan-100">
                <Truck className="h-3 w-3" />
                Transport
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 text-indigo-700 px-2.5 py-1 border border-indigo-100">
                <Plane className="h-3 w-3" />
                Aviation
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-1 border border-emerald-100">
                <Building2 className="h-3 w-3" />
                Property
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pb-4 text-center text-[11px] text-slate-500">
        © {currentYear} Otithee. All rights reserved.
      </footer>
    </main>
  );
};

export default MainPage;
