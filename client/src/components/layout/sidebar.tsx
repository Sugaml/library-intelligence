import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  BarChart3, 
  Package, 
  Users, 
  FileText, 
  Book, 
  Search, 
  QrCode, 
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  const studentNavItems = [
    { icon: Home, label: "Dashboard", path: "/student-dashboard" },
    { icon: Search, label: "Browse Books", path: "/book-catalog" },
    { icon: Bookmark, label: "My Books", path: "/my-books" },
    { icon: QrCode, label: "QR Scanner", path: "/qr-scanner" },
  ];

  const librarianNavItems = [
    { icon: BarChart3, label: "Analytics", path: "/librarian-dashboard" },
    { icon: Package, label: "Inventory", path: "/inventory-management" },
    { icon: Users, label: "Students", path: "/student-management" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  const navItems = user?.role === 'student' ? studentNavItems : librarianNavItems;

  return (
    <div className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Building2 className="tu-text-blue text-xl" />
              <span className="font-bold text-sidebar-foreground">TU Library</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    collapsed ? 'px-2' : 'px-3'
                  } ${
                    isActive 
                      ? 'tu-bg-blue text-white hover:bg-blue-700' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${collapsed ? '' : 'mr-3'}`} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
              <Users className="w-4 h-4 text-sidebar-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.role === 'student' ? user?.studentId : 'Librarian'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
