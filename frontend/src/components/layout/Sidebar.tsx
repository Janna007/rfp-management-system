import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Users,
  PlusCircle,
  Sparkles,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/rfps", icon: FileText, label: "RFPs" },
  { to: "/rfps/create", icon: PlusCircle, label: "Create RFP" },
  { to: "/vendors", icon: Users, label: "Vendors" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-ai">
            <Sparkles className="h-5 w-5 text-sidebar-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">RFP Manager</h1>
            <p className="text-xs text-sidebar-foreground/60">AI-Powered</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to 
            // || (item.to !== "/" && location.pathname.startsWith(item.to));
            
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/60">
              <Sparkles className="h-4 w-4 text-sidebar-primary" />
              <span>AI-powered insights</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
