import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, LogOut, User, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";

interface NavbarProps {
  title: string;
  showBackButton?: boolean;
  backPath?: string;
  navigationItems?: Array<{
    label: string;
    path: string;
    onClick?: () => void;
  }>;
}

export default function Navbar({ 
  title, 
  showBackButton = false, 
  backPath = "/", 
  navigationItems = [] 
}: NavbarProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            {showBackButton ? (
              <Link href={backPath}>
                <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <span>←</span>
                  <span>Back</span>
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Building2 className="tu-text-blue text-xl" />
                <span className="font-bold text-gray-900">{title}</span>
              </div>
            )}
            
            {navigationItems.length > 0 && (
              <div className="hidden md:flex space-x-6">
                {navigationItems.map((item, index) => (
                  <Link key={index} href={item.path}>
                    <Button
                      variant="ghost"
                      className={`px-1 pt-1 pb-4 text-sm font-medium ${
                        location === item.path
                          ? 'tu-text-blue border-b-2 tu-border-blue'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                      onClick={item.onClick}
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="sm" className="bg-gray-100 p-2 rounded-full text-gray-600 hover:text-gray-800">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={logout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
