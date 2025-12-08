"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Profile from "./Profile";
import { Menu } from "lucide-react";

type HeaderProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header
      className="
        sticky top-0 h-16
        bg-white border-b shadow-sm
        flex items-center justify-between
        px-4 sm:px-6 z-10
      "
    >
      {/* LEFT SIDE → Toggle + Logo + Search */}
      <div className="flex items-center gap-3">

        {/* Mobile-only toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-full hover:bg-slate-100"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>



        {/* Search box (left aligned) */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-3 ml-2">
          <input
            className="bg-transparent border-none outline-none text-sm w-40 sm:w-48"
            placeholder="Search…"
          />
        </div>
      </div>

      {/* RIGHT SIDE → Button + Profile */}
      <div className="flex items-center gap-3">
        <Button className="hidden sm:inline-flex">New Reservation</Button>
        <Profile />
      </div>
    </header>
  );
};

export default Header;
