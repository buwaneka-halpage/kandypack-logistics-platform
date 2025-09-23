import React from 'react';
import { 
  Package, 
  TrendingUp, 
  Calendar, 
  Truck,
  BarChart3,
  MapPin,
  Users,
  Download,
} from 'lucide-react';

// Import your TypeScript components
import StatsCard from './StatsCard';
import WeeklyOrderChart from './WeeklyOrderChart';
import DeliveryProgress from './DeliveryProgress';
import LogisticsMap from './LogisticsMap';
import AdminOverview from './AdminOverview';
import { DashboardHeader } from './DashboardHeader';
import Sidebar from './Sidebar';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen dashboard-bg">
      {/* Header */}

      <DashboardHeader />


      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

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
              <LogisticsMap />
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