import { useLocation } from "react-router-dom";
import { navigationConfig } from "../config/navigation";
import { SearchInput } from "./common/SearchInput";
import { ChevronRight } from "../config/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router-dom";

import { NotificationCenter } from "./system/NotificationCenter";
import { ActivityCenter } from "./system/activity/ActivityCenter";
import { useProfile } from "../contexts/ProfileContext";
import { User } from "lucide-react";

export default function Header() {
  const location = useLocation();
  const { profile } = useProfile();

  let currentItemName = "Dashboard";
  for (const section of navigationConfig) {
    const found = section.items.find((item) => item.href === location.pathname);
    if (found) {
      currentItemName = found.name;
      break;
    }
  }

  return (
    <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 shadow-sm">
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="hover:text-foreground transition-colors cursor-pointer">Home</span>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="font-medium text-foreground">{currentItemName}</span>
      </div>
      
      <div className="flex items-center space-x-4 flex-1 justify-end">
        <div onClick={() => document.dispatchEvent(new Event('cmd-palette:open'))}>
          <SearchInput className="w-64 hidden sm:flex cursor-pointer pointer-events-auto" />
        </div>

        <NotificationCenter />
        <ActivityCenter />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 overflow-hidden shrink-0">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.fullName} className="h-full w-full object-cover" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                {profile.photo ? (
                  <img src={profile.photo} alt={profile.fullName} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm truncate">{profile.fullName}</p>
                <p className="w-[150px] truncate text-xs text-muted-foreground">{profile.title}</p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/preferences" className="w-full cursor-pointer">Preferences</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>About StackLab</DropdownMenuItem>
            <DropdownMenuItem disabled>Version 1.0</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
