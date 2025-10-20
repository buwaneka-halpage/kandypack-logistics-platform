import React, { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { UserRole, getRoleName } from '~/types/roles';
import { 
  Package, 
  TrendingUp, 
  Calendar, 
  Truck,
  BarChart3,
  MapPin,
  Users,
  Warehouse,
  AlertCircle,
  ClipboardList,
  Navigation,
} from 'lucide-react';

// Import API services
import { 
  UsersAPI, 
  OrdersAPI, 
  StoresAPI, 
  DriversAPI, 
  AssistantsAPI,
  TrucksAPI,
  RoutesAPI 
} from '~/services/api';

// Import existing components
import StatsCard from './StatsCard';
import WeeklyOrderChart from './WeeklyOrderChart';
import DeliveryProgress from './DeliveryProgress';
import LogisticsMap from './LogisticsMap';
import AdminOverview from './AdminOverview';
import DashboardLayout from './DashboardLayout';

const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Please log in to view the dashboard.</p>
        </div>
      </DashboardLayout>
    );
  }

  // Render different dashboard based on role
  switch (user.role) {
    case UserRole.MANAGEMENT:
      return <ManagementDashboard user={user} />;
    
    case UserRole.SYSTEM_ADMIN:
      return <SystemAdminDashboard user={user} />;
    
    case UserRole.STORE_MANAGER:
      return <StoreManagerDashboard user={user} />;
    
    case UserRole.WAREHOUSE_STAFF:
      return <WarehouseStaffDashboard user={user} />;
    
    case UserRole.DRIVER:
      return <DriverDashboard user={user} />;
    
    case UserRole.DRIVER_ASSISTANT:
      return <DriverAssistantDashboard user={user} />;
    
    default:
      return (
        <DashboardLayout>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">
                  Role Not Configured
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your role ({getRoleName(user.role)}) doesn't have a dashboard configured yet.
                </p>
              </div>
            </div>
          </div>
        </DashboardLayout>
      );
  }
};

// Management Dashboard - Full System Overview
const ManagementDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleName(user.role)} Dashboard - Complete System Overview
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Total Orders"
          value="0"
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="Today's Revenue"
          value="Rs 700,000"
          icon={<TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-accent" />}
        />
        <StatsCard
          title="Active Warehouses"
          value="12"
          icon={<Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-primary-navy" />}
        />
        <StatsCard
          title="Unassigned Orders"
          value="8"
          icon={<AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
        />
      </div>

      {/* Middle Section - Chart and Progress */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="xl:col-span-2 order-1">
          <WeeklyOrderChart />
        </div>
        <div className="order-2">
          <DeliveryProgress />
        </div>
      </div>

      {/* Bottom Section - Map and Admin Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <div className="order-2 lg:order-2">
          <AdminOverview />
        </div>
        <div className="order-1 lg:order-1">
          <LogisticsMap />
        </div>
      </div>
    </DashboardLayout>
  );
};

// System Admin Dashboard - Same as Management with System Focus
const SystemAdminDashboard: React.FC<{ user: any }> = ({ user }) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    systemHealth: '99.8%',
    activeWarehouses: 0,
    pendingTasks: 0,
    loading: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real data from APIs
        const [usersData, storesData, ordersData] = await Promise.all([
          UsersAPI.getAll().catch((err) => {
            console.error('Error fetching users:', err);
            return [];
          }),
          StoresAPI.getAll().catch((err) => {
            console.error('Error fetching stores:', err);
            return [];
          }),
          OrdersAPI.getAll({ status: 'PLACED' }).catch((err) => {
            console.error('Error fetching orders:', err);
            return [];
          })
        ]);

        console.log('Users data:', usersData);
        console.log('Stores data:', storesData);
        console.log('Orders data:', ordersData);

        setStats({
          totalUsers: usersData?.length || 0,
          systemHealth: '99.8%', // This would come from a health endpoint
          activeWarehouses: storesData?.length || 0,
          pendingTasks: ordersData?.length || 0,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome,
        </h1>
        <p className="text-gray-600 mt-1">
          System Administrator Dashboard - System Administration
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Total Users"
          value={stats.loading ? '...' : stats.totalUsers.toString()}
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="System Health"
          value={stats.systemHealth}
          icon={<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
        />
        <StatsCard
          title="Active Warehouses"
          value={stats.loading ? '...' : stats.activeWarehouses.toString()}
          icon={<Warehouse className="w-5 h-5 sm:w-6 sm:h-6 text-primary-navy" />}
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.loading ? '...' : stats.pendingTasks.toString()}
          icon={<ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
        />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <div className="xl:col-span-2 order-1">
          <WeeklyOrderChart />
        </div>
        <div className="order-2">
          <DeliveryProgress />
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <div className="order-2 lg:order-2">
          <AdminOverview />
        </div>
        <div className="order-1 lg:order-1">
          <LogisticsMap />
        </div>
      </div>
    </DashboardLayout>
  );
};

// Store Manager Dashboard - Warehouse-Specific View
const StoreManagerDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardLayout>
      {/* Welcome Message with Warehouse Info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleName(user.role)} - {user.warehouseName || 'No Warehouse Assigned'}
        </p>
        {!user.warehouseId && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              You are not assigned to a warehouse. Please contact management.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards Row - Warehouse Specific */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Warehouse Orders"
          value="0"
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="Pending Shipments"
          value="0"
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-accent" />}
        />
        <StatsCard
          title="Active Routes"
          value="0"
          icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-navy" />}
        />
        <StatsCard
          title="Available Drivers"
          value="0"
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <WeeklyOrderChart />
        <DeliveryProgress />
      </div>
    </DashboardLayout>
  );
};

// Warehouse Staff Dashboard - Limited to Inventory Operations
const WarehouseStaffDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleName(user.role)} - {user.warehouseName || 'No Warehouse Assigned'}
        </p>
        {!user.warehouseId && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              You are not assigned to a warehouse. Please contact your manager.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Orders to Process"
          value="0"
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="Incoming Shipments"
          value="0"
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-accent" />}
        />
        <StatsCard
          title="Ready for Dispatch"
          value="0"
          icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
        />
      </div>

      {/* Progress Widget */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
        <DeliveryProgress />
      </div>
    </DashboardLayout>
  );
};

// Driver Dashboard - Personal Deliveries
const DriverDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleName(user.role)} Dashboard
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Today's Deliveries"
          value="0"
          icon={<Package className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="Completed"
          value="0"
          icon={<BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
        />
        <StatsCard
          title="Remaining"
          value="0"
          icon={<Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
        />
      </div>

      {/* Map for Routes */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
        <LogisticsMap />
      </div>
    </DashboardLayout>
  );
};

// Driver Assistant Dashboard - Schedule Management
const DriverAssistantDashboard: React.FC<{ user: any }> = ({ user }) => {
  return (
    <DashboardLayout>
      {/* Welcome Message */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-gray-600 mt-1">
          {getRoleName(user.role)} - {user.warehouseName || 'No Warehouse Assigned'}
        </p>
        {!user.warehouseId && (
          <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-yellow-700">
              You are not assigned to a warehouse. Please contact management.
            </p>
          </div>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
        <StatsCard
          title="Today's Schedules"
          value="0"
          icon={<Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-dashboard-chart" />}
        />
        <StatsCard
          title="Available Drivers"
          value="0"
          icon={<Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />}
        />
        <StatsCard
          title="Active Trucks"
          value="0"
          icon={<Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-navy" />}
        />
        <StatsCard
          title="Pending Routes"
          value="0"
          icon={<MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />}
        />
      </div>

      {/* Map and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
        <LogisticsMap />
        <DeliveryProgress />
      </div>
    </DashboardLayout>
  );
};

export default RoleBasedDashboard;
