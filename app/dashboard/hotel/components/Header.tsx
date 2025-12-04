import React from "react";
import Profile from "../../components/Profile";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header
      className="
          fixed left-72 right-0 top-0 h-16
          bg-white border-b shadow-sm
          flex items-center justify-between
          px-6 z-30
        "
    >
      <div className="">
        {/* Search box (simple) */}
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 justify-between gap-4">
          <div>
            <input
              className="bg-transparent border-0 outline-none text-sm"
              placeholder="Search…"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        {/* Action button (example) */}
        <Button className="hidden sm:inline-flex">New Reservation</Button>

        <Profile></Profile>
      </div>
    </header>
  );
};

export default Header;
