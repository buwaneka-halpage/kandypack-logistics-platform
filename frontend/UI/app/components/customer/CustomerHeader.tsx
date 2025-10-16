import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import UserAvatar from "../UserAvatar";
import { useSidebar } from "~/contexts/SidebarContext";
import { useAuth } from "~/hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export function CustomerHeader() {
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
    setShowDropdown(false);
    localStorage.removeItem('kandypack_user');
    window.location.href = '/login';
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
          <h1 className="text-lg sm:text-xl font-bold text-[#282F4E]">
            Kandy<span className="text-[#5D5FEF]">Pack</span>
          </h1>
        </div>
        
        {/* Search Bar - Center on desktop */}
        <div className="relative hidden md:block flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="Search home"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5D5FEF] focus:border-[#5D5FEF] transition-colors bg-gray-50"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
          {/* Mobile Search Button */}
          <button className="md:hidden p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 sm:p-2 transition-colors"
            >
              <UserAvatar name={user?.name || 'User'} size="sm" />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-gray-800">User</p>
                <p className="text-xs text-gray-500">ID: {user?.id || '1234567'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 hidden sm:block transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  <p className="text-xs text-gray-500 mt-1">ID: {user?.id || '1234567'}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Add profile navigation
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      // Add settings navigation
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Settings
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-1 pb-1">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                  >
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
