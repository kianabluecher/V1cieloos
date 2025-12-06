import { User, Settings, LogOut, HeadphonesIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

type ProfileDropdownProps = {
  user: {
    name: string;
    email: string;
    role: string;
    userType: "client" | "team" | "management";
  };
  onManageProfile: () => void;
  onSettings: () => void;
  onService?: () => void;
  onLogout: () => void;
  isCollapsed?: boolean;
};

export function ProfileDropdown({
  user,
  onManageProfile,
  onSettings,
  onService,
  onLogout,
  isCollapsed = false,
}: ProfileDropdownProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (userType: string) => {
    switch (userType) {
      case "client":
        return "text-cyan-accent";
      case "team":
        return "text-teal";
      case "management":
        return "text-violet";
      default:
        return "text-cyan-accent";
    }
  };

  const getRoleLabel = (userType: string) => {
    switch (userType) {
      case "client":
        return "Client";
      case "team":
        return "Team";
      case "management":
        return "Management";
      default:
        return "User";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-cyan-accent/5 hover:border-cyan-accent/20 border border-transparent transition-all duration-300 group ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <Avatar className="w-10 h-10 border-2 border-cyan-accent/20">
            <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm text-white group-hover:text-cyan-accent transition-colors">
                {user.name}
              </p>
              <p className="text-xs text-text-secondary">{user.role}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        sideOffset={8}
        className="border p-2 rounded-lg"
        style={{ 
          backgroundColor: '#0F0F0F', 
          borderColor: '#1F1F1F',
          width: isCollapsed ? '240px' : 'var(--radix-dropdown-menu-trigger-width)',
          maxWidth: '256px'
        }}
      >
        <div className="px-2 py-3 mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-cyan-accent/20">
              <AvatarFallback className="bg-gradient-to-br from-cyan-accent/20 to-violet/20 text-cyan-accent">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white mb-1">{user.name}</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-accent rounded-full" />
                <p className={`text-xs ${getRoleColor(user.userType)}`}>
                  {getRoleLabel(user.userType)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border-subtle" />

        <DropdownMenuItem
          onClick={onManageProfile}
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-cyan-accent/5 hover:text-gray-400 cursor-pointer rounded-lg focus:bg-cyan-accent/5 focus:text-gray-400"
        >
          <User className="h-4 w-4" />
          <span>Manage Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onSettings}
          className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-cyan-accent/5 hover:text-gray-400 cursor-pointer rounded-lg focus:bg-cyan-accent/5 focus:text-gray-400"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        {user.userType === "client" && onService && (
          <DropdownMenuItem
            onClick={onService}
            className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:bg-cyan-accent/5 hover:text-gray-400 cursor-pointer rounded-lg focus:bg-cyan-accent/5 focus:text-gray-400"
          >
            <HeadphonesIcon className="h-4 w-4" />
            <span>Service Plan</span>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator className="bg-border-subtle" />

        <DropdownMenuItem
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-400/5 hover:text-red-400 cursor-pointer rounded-lg focus:bg-red-400/5 focus:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
