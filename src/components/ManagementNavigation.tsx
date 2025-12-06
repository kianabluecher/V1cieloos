import { ChevronDown } from "lucide-react";
import { Badge } from "./ui/badge";

interface SubItem {
  id: string;
  label: string;
  icon: any;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  isExpandable: boolean;
  subItems?: SubItem[];
  badge?: string;
}

interface ManagementNavigationProps {
  navigationItems: NavItem[];
  activeNav: string;
  activePage: string;
  expandedMenus: string[];
  billingSubmenu: string | null;
  isSidebarCollapsed: boolean;
  onToggleMenu: (menuId: string) => void;
  onNavigate: (navId: string, submenu?: string) => void;
}

export function ManagementNavigation({
  navigationItems,
  activeNav,
  activePage,
  expandedMenus,
  billingSubmenu,
  isSidebarCollapsed,
  onToggleMenu,
  onNavigate,
}: ManagementNavigationProps) {
  return (
    <nav className="flex-1 p-4 space-y-1">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id && activePage === "main";
        const isExpanded = expandedMenus.includes(item.id);
        const hasSubItems = item.subItems && item.subItems.length > 0;
        
        return (
          <div key={item.id}>
            <button
              onClick={() => {
                if (hasSubItems) {
                  onToggleMenu(item.id);
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive && !hasSubItems
                  ? "bg-[#1F1F1F] text-white"
                  : "text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-sm">{item.label}</span>
                )}
              </div>
              {!isSidebarCollapsed && (
                <>
                  {hasSubItems && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  )}
                  {item.badge && (
                    <Badge 
                      variant="outline" 
                      className="bg-red-500/10 text-red-400 border-red-500/20 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </button>
            
            {/* Submenu Items */}
            {hasSubItems && isExpanded && !isSidebarCollapsed && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#2A2A2A] pl-3">
                {item.subItems?.map((subItem) => {
                  const SubIcon = subItem.icon;
                  const isSubActive = 
                    activeNav === item.id && 
                    ((item.id === "billing" && billingSubmenu === subItem.id.replace("billing-", "")) ||
                     (item.id === "clients" && activeNav === "clients"));
                  
                  return (
                    <button
                      key={subItem.id}
                      onClick={() => {
                        if (item.id === "billing") {
                          onNavigate(item.id, subItem.id.replace("billing-", ""));
                        } else {
                          onNavigate(item.id);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        isSubActive
                          ? "text-white bg-[#1A1A1A]"
                          : "text-[#808080] hover:text-white hover:bg-[#151515]"
                      }`}
                    >
                      <SubIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm">{subItem.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
