"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const handleLogout = () => {
    console.log("logout clicked");
    // Your actual logout logic here
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 rounded-full px-2 py-1 hover:bg-slate-100">
          <Avatar className="w-9 h-9">
            <AvatarImage src="/avatar.jpg" alt="Jaman" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start text-left">
            <span className="text-sm font-medium">Jaman</span>
            <span className="text-xs text-slate-500">Admin</span>
          </div>
        </div>
      </DropdownMenuTrigger>

      {/* Dropdown menu content is already using a portal to avoid scroll clipping */}
      <DropdownMenuContent align="end" className="w-44" forceMount>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Profile;
