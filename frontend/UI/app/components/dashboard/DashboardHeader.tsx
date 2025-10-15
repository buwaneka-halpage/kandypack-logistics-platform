import { Bell, Search, ChevronDown, Menu, LogOut } from "lucide-react";
import UserAvatar from "../UserAvatar";
import { useSidebar } from "~/contexts/SidebarContext";
import { useAuth } from "~/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export function DashboardHeader() {
  const { toggleMobileMenu } = useSidebar();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <header 
      className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 sticky top-0 z-[9999] w-full"
      style={{ height: 'var(--header-height)' } as React.CSSProperties}
    >
      <div className="flex items-center justify-between">
        {/* Logo/Brand with Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-600 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          {/* KandyPack Logo */}
          <h1 className="text-lg sm:text-xl font-bold text-primary-navy">
            Kandy<span className="text-dashboard-accent">Pack</span>
          </h1>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Search Bar - Hidden on mobile, visible on larger screens */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search items, routes or drivers..."
              className="w-48 lg:w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dashboard-accent focus:border-dashboard-accent transition-colors"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 bg-dashboard-accent rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <UserAvatar
                src="/api/placeholder/32/32"
                name={user?.name || "Admin User"}
                size="sm"
              />
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-primary-navy">{user?.name || "Admin User"}</p>
                <p className="text-xs text-gray-500">{user?.role || "Administrator"}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-primary-navy transition-all hidden sm:block ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">{user?.name || "Admin User"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "admin@kandypack.com"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          
          {/* Quick Action Button */}
          <button className="bg-dashboard-accent hover:bg-dashboard-accent text-white px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors">
            <span className="hidden sm:inline">New Order</span>
            <span className="sm:hidden">+</span>
          </button>
        </div>
      </div>
    </header>
  );
}