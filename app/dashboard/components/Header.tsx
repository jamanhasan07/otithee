import { Button } from "@/components/ui/button";
import Profile from "./Profile";

const Header = () => {
  return (
    <header
      className="
        sticky top-0 h-16
        bg-white border-b shadow-sm
        flex items-center justify-between
        px-6 z-30
      "
    >
      <div>
        <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-2 gap-4">
          <input
            className="bg-transparent border-0 outline-none text-sm"
            placeholder="Search…"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="hidden sm:inline-flex">New Reservation</Button>
        <Profile />
      </div>
    </header>
  );
};

export default Header
