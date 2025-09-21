import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Calendar, 
  Truck,
  BarChart3,
  MapPin,
  Users,
  Download
} from 'lucide-react';

// Import your future components (placeholders for now)
import StatsCard from './components/StatsCard';
import WeeklyOrderChart from './components/WeeklyOrderChart';
import DeliveryProgress from './components/DeliveryProgress';
import StoreLocationsMap from './components/StoreLocationsMap';
import AdminOverview from './components/AdminOverview';

const Dashboard = () => {
  return (
    <div className="min-h-screen dashboard-bg">
      {/* Header */}
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

      <div className="flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Request For Quotation"
              value="0"
              icon={<Package className="w-6 h-6 text-blue-600" />}
            />
            <StatsCard
              title="Today's Revenue"
              value="Rs 700,000"
              icon={<TrendingUp className="w-6 h-6 text-green-600" />}
            />
            <StatsCard
              title="Scheduled Train Shipments"
              value="50"
              icon={<Calendar className="w-6 h-6 text-purple-600" />}
            />
            <StatsCard
              title="Active Truck Routes"
              value="12 routes"
              icon={<Truck className="w-6 h-6 text-orange-600" />}
            />
          </div>

          {/* Middle Section - Chart and Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Weekly Order Volume Chart */}
            <div className="lg:col-span-2">
              <WeeklyOrderChart />
            </div>
            
            {/* Delivery Progress */}
            <div>
              <DeliveryProgress />
            </div>
          </div>

          {/* Bottom Section - Map and Admin Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Store Locations Map */}
            <div>
              <StoreLocationsMap />
            </div>
            
            {/* Admin Overview */}
            <div>
              <AdminOverview />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;