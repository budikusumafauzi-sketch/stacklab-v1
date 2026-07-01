import { Link, useLocation } from "react-router-dom";
import { useWorkspace } from "../hooks/useWorkspace";
import { navigationConfig } from "../config/navigation";
import { cn } from "../lib/utils";
import { APP_NAME } from "../config/constants";
import { ChevronLeft, ChevronRight } from "../config/icons";

export default function Sidebar() {
  const location = useLocation();
  const { state, setSidebarCollapsed } = useWorkspace();
  const isCollapsed = state.sidebarCollapsed;

  return (
    <aside
      className={cn(
        "border-r border-border bg-background flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-foreground tracking-tight truncate">
            {APP_NAME}
          </h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
            isCollapsed && "mx-auto"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 space-y-6 overflow-x-hidden">
        {navigationConfig.map((section, idx) => (
          <div key={idx}>
            {section.title && !isCollapsed && (
              <h2 className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {section.title}
              </h2>
            )}
            <nav className="space-y-1 px-2">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    title={isCollapsed ? item.name : undefined}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", !isCollapsed && "mr-3")} aria-hidden="true" />
                    {!isCollapsed && <span className="truncate">{item.name}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>
      
      {!isCollapsed && (
        <div className="p-4 border-t border-border text-xs text-muted-foreground text-center shrink-0">
          &copy; {new Date().getFullYear()} {APP_NAME}
        </div>
      )}
    </aside>
  );
}
