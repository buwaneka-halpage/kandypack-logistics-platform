import { Bell, Search, ChevronDown } from "lucide-react";
import UserAvatar from "../UserAvatar";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-primary-navy">
            Kandy<span className="text-dashboard-accent">Pack</span>
          </h1>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search items, routes or drivers..."
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-dashboard-accent focus:border-dashboard-accent transition-colors"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-primary-navy hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-dashboard-accent rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* User Profile Dropdown */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <UserAvatar
              src="/api/placeholder/32/32"
              name="Admin User"
              size="sm"
            />
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-primary-navy">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-primary-navy transition-colors" />
          </div>
          
          {/* Quick Action Button */}
          <button className="bg-dashboard-accent hover:bg-dashboard-accent text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            New Order
          </button>
        </div>
      </div>
    </header>
  );
}