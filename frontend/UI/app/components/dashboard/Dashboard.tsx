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
import DashboardLayout from './DashboardLayout';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            <StatsCard
              title="Request For Quotation"
              value="0"
              icon={<Package className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
            />
            <StatsCard
              title="Today's Revenue"
              value="Rs 700,000"
              icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-accent" />}
            />
            <StatsCard
              title="Scheduled Train Shipments"
              value="50"
              icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-navy" />}
            />
            <StatsCard
              title="Active Truck Routes"
              value="12 routes"
              icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-accent" />}
            />
          </div>

          {/* Middle Section - Chart and Progress */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            {/* Weekly Order Volume Chart */}
            <div className="xl:col-span-2 order-1">
              <WeeklyOrderChart />
            </div>
            
            {/* Delivery Progress */}
            <div className="order-2">
              <DeliveryProgress />
            </div>
          </div>

          {/* Bottom Section - Map and Admin Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            {/* Admin Overview - Show first on mobile */}
            <div className="order-2 lg:order-2">
              <AdminOverview />
            </div>
            
            {/* Store Locations Map - Show second on mobile for better UX */}
            <div className="order-1 lg:order-1">
              <LogisticsMap />
            </div>
          </div>
    </DashboardLayout>
  );
};

export default Dashboard;