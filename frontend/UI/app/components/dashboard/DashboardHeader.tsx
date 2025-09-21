import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export function DashboardHeader() {
  return (
    // <header className="bg-white border-b border-gray-200 px-8 py-4">
    //   <div className="flex items-center justify-between">
    //     {/* Page Title */}
    //     <div>
    //       <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    //       <p className="text-sm text-gray-600">Welcome back! Here's what's happening with your logistics operations.</p>
    //     </div>
        
    //     {/* Header Actions */}
    //     <div className="flex items-center gap-4">
    //       {/* Search */}
    //       <div className="relative">
    //         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    //           <Search className="h-5 w-5 text-gray-400" />
    //         </div>
    //         <input
    //           type="text"
    //           placeholder="Search orders, shipments..."
    //           className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
    //         />
    //       </div>
          
    //       {/* Notifications */}
    //       <button className="relative p-2 text-gray-400 hover:text-gray-500">
    //         <span className="sr-only">View notifications</span>
    //         <Bell className="h-6 w-6" />
    //         <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
    //       </button>

    //       <button className="relative p-2 text-gray-400 hover:text-gray-500">
    //         <Avatar>
    //           <AvatarImage src="../../public/8121295.gif" alt="User Avatar" /> {/* Make this the user profile image */}
    //           <AvatarFallback>U</AvatarFallback>
    //         </Avatar>
    //         <span className="sr-only">User menu</span>
    //       </button>
          
    //       {/* Quick Actions */}
    //       <button className="dashboard-accent px-4 py-2 rounded-md text-sm font-medium">
    //         New Order
    //       </button>
    //     </div>
    //   </div>
    // </header>

    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items, routes or drivers..."
              className="w-80 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5zm0 0V3" />
            </svg>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <img 
              src="/api/placeholder/32/32" 
              alt="Admin"
              className="w-8 h-8 rounded-full"
            />
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}