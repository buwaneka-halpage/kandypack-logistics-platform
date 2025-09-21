import { BarChart3, Calendar, Package, Truck, Users } from "lucide-react";


export function Sidebar() {
  return (
    <aside className="w-64 dashboard-sidebar text-white min-h-screen">
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-8">
              <Package className="w-8 h-8 text-dashboard-accent" />
              <h1 className="text-xl font-bold">
                Kandy<span className="text-dashboard-accent">Pack</span>
              </h1>
            </div>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-blue-600 rounded-lg text-white">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Package className="w-5 h-5" />
                <span>Order Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Calendar className="w-5 h-5" />
                <span>Rail Scheduling</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Truck className="w-5 h-5" />
                <span>Last-Mile Delivery</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Package className="w-5 h-5" />
                <span>Store Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Users className="w-5 h-5" />
                <span>Admin Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Truck className="w-5 h-5" />
                <span>Router Management</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <BarChart3 className="w-5 h-5" />
                <span>Reports</span>
              </a>
              <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-slate-700 rounded-lg">
                <Package className="w-5 h-5" />
                <span>Activity Logs</span>
              </a>
            </nav>
          </div>
          </aside>
    );
  }