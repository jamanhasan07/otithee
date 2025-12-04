// app/dashboard/hotel/layout.tsx
"use client";

import React from "react";
import { HOTEL_MODULES } from "@/lib/modules";
import HotelSidebar from "../components/HotelSidebar";

// shadcn/ui components (adjust paths if your project places them elsewhere)
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleLogout = () => {
    // wire your logout logic here (router push / auth signOut)
    console.log("logout clicked");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* FIXED SIDEBAR */}
      <aside
        className="w-72 h-screen overflow-y-auto border-r bg-white fixed left-0 top-0 z-40"
        aria-label="Hotel navigation"
      >
        <HotelSidebar modules={HOTEL_MODULES} />
      </aside>

      {/* TOPBAR (shadcn/ui for profile dropdown) */}
      <header
        className="
          fixed left-72 right-0 top-0 h-16
          bg-white border-b shadow-sm
          flex items-center justify-between
          px-6 z-30
        "
      >
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="hidden md:flex items-center ml-4 text-sm text-slate-500">
            Live overview · Updated just now
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search box (simple) */}
          <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-2">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="opacity-60"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              className="bg-transparent border-0 outline-none text-sm"
              placeholder="Search…"
            />
          </div>

          {/* Action button (example) */}
          <Button className="hidden sm:inline-flex">New Reservation</Button>

          {/* Profile dropdown using shadcn/ui DropdownMenu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-slate-100">
                <Avatar className="w-9 h-9">
                  {/* use AvatarImage if you have an image, fallback otherwise */}
                  <AvatarImage src="/avatar.jpg" alt="Jaman" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-sm font-medium">Jaman</span>
                  <span className="text-xs text-slate-500">Admin</span>
                </div>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => console.log("Go to profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log("Open settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* MAIN: reserve left space for sidebar and top space for topbar */}
      <main
        className="
          ml-72        /* space for sidebar */
          pt-16        /* space for topbar */
          p-6
          min-h-screen
          overflow-auto
          mt-6
        "
      >
        {children}
      </main>
    </div>
  );
}
