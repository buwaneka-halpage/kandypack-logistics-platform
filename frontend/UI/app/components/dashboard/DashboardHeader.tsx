import { Bell, Search } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your logistics operations.</p>
        </div>
        
        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders, shipments..."
              className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          
          {/* Notifications */}
          <button className="relative p-2 text-gray-400 hover:text-gray-500">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>
          
          {/* Quick Actions */}
          <button className="dashboard-accent px-4 py-2 rounded-md text-sm font-medium">
            New Order
          </button>
        </div>
      </div>
    </header>
  );
}