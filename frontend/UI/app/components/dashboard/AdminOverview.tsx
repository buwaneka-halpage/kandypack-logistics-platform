import React, { useState, useEffect } from 'react';
import UserAvatar from '../UserAvatar';
import { DriversAPI, AssistantsAPI, UsersAPI, StoresAPI, TrucksAPI, RoutesAPI } from '~/services/api';

interface StaffMember {
  name: string;
  role: string;
  id: string;
  avatar?: string | null;
  status: 'active' | 'offline';
}

interface SystemStats {
  staffByRole: {
    drivers: number;
    activeDrivers: number;
    assistants: number;
    storeManagers: number;
    warehouseStaff: number;
    management: number;
    customers: number;
  };
  operationalMetrics: {
    totalStores: number;
    availableTrucks: number;
    totalTrucks: number;
    activeRoutes: number;
  };
  systemHealth: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
  };
}

const AdminOverview: React.FC = () => {
  const [recentStaff, setRecentStaff] = useState<StaffMember[]>([]);
  const [systemStats, setSystemStats] = useState<SystemStats>({
    staffByRole: {
      drivers: 0,
      activeDrivers: 0,
      assistants: 0,
      storeManagers: 0,
      warehouseStaff: 0,
      management: 0,
      customers: 0
    },
    operationalMetrics: {
      totalStores: 0,
      availableTrucks: 0,
      totalTrucks: 0,
      activeRoutes: 0
    },
    systemHealth: {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemData = async () => {
      try {
        // Fetch all data in parallel
        const [drivers, assistants, allUsers, stores, trucks, routes] = await Promise.all([
          DriversAPI.getAll().catch(() => []),
          AssistantsAPI.getAll().catch(() => []),
          UsersAPI.getAll().catch(() => []),
          StoresAPI.getAll().catch(() => []),
          TrucksAPI.getAll().catch(() => []),
          RoutesAPI.getAll().catch(() => [])
        ]);

        // Process drivers
        const activeDrivers = (drivers || []).filter((d: any) => d.status === 'active').length;
        
        // Process users by role
        const usersByRole = (allUsers || []).reduce((acc: any, user: any) => {
          const role = user.role?.toLowerCase() || '';
          if (role.includes('storemanager')) acc.storeManagers++;
          else if (role.includes('warehousestaff')) acc.warehouseStaff++;
          else if (role.includes('management')) acc.management++;
          else if (role.includes('customer')) acc.customers++;
          return acc;
        }, { storeManagers: 0, warehouseStaff: 0, management: 0, customers: 0 });

        // Process trucks - assuming trucks with status 'available' or without active route
        const availableTrucks = (trucks || []).filter((t: any) => 
          t.status === 'available' || t.availability === 'available'
        ).length;

        // Process routes - count active routes (today's routes)
        const today = new Date().toISOString().split('T')[0];
        const activeRoutes = (routes || []).filter((r: any) => 
          r.status === 'active' || r.date === today
        ).length;

        // Create recent staff list (mix of drivers and assistants)
        const staffList: StaffMember[] = [
          ...(drivers || []).slice(0, 3).map((driver: any) => ({
            name: driver.name || `Driver ${driver.driver_id}`,
            role: 'Driver',
            id: driver.driver_id || '',
            avatar: null,
            status: (driver.status === 'active' ? 'active' : 'offline') as 'active' | 'offline'
          })),
          ...(assistants || []).slice(0, 2).map((assistant: any) => ({
            name: assistant.name || `Assistant ${assistant.assistant_id}`,
            role: 'Driver Assistant',
            id: assistant.assistant_id || '',
            avatar: null,
            status: 'active' as 'active' | 'offline'
          }))
        ];

        setRecentStaff(staffList);
        setSystemStats({
          staffByRole: {
            drivers: (drivers || []).length,
            activeDrivers,
            assistants: (assistants || []).length,
            storeManagers: usersByRole.storeManagers,
            warehouseStaff: usersByRole.warehouseStaff,
            management: usersByRole.management,
            customers: usersByRole.customers
          },
          operationalMetrics: {
            totalStores: (stores || []).length,
            availableTrucks,
            totalTrucks: (trucks || []).length,
            activeRoutes
          },
          systemHealth: {
            totalUsers: (allUsers || []).length,
            activeUsers: (allUsers || []).length, // TODO: Implement last_login logic
            inactiveUsers: 0 // TODO: Calculate inactive users
          }
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching system data:', error);
        setLoading(false);
      }
    };

    fetchSystemData();
  }, []);

  if (loading) {
    return (
      <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-dashboard-text-secondary">Loading system data...</div>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h3 className="text-base sm:text-lg font-semibold text-dashboard-text-primary">System Overview</h3>
        <button className="text-xs sm:text-sm text-dashboard-accent hover:text-primary-coral font-medium">
          View All
        </button>
      </div>
      
      {/* System Health Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg">
          <div className="text-lg sm:text-xl font-bold text-dashboard-text-primary">{systemStats.systemHealth.totalUsers}</div>
          <div className="text-xs text-dashboard-text-secondary">Total Users</div>
        </div>
        <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg">
          <div className="text-lg sm:text-xl font-bold text-status-delivered">{systemStats.systemHealth.activeUsers}</div>
          <div className="text-xs text-dashboard-text-secondary">Active</div>
        </div>
        <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg">
          <div className="text-lg sm:text-xl font-bold text-status-cancelled">{systemStats.systemHealth.inactiveUsers}</div>
          <div className="text-xs text-dashboard-text-secondary">Inactive</div>
        </div>
      </div>

      {/* Staff by Role */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-sm font-semibold text-dashboard-text-primary mb-3">Staff by Role</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 bg-dashboard-bg rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-coral"></div>
              <span className="text-xs sm:text-sm text-dashboard-text-primary">Drivers</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-dashboard-text-primary">
              {systemStats.staffByRole.drivers} <span className="text-status-delivered">({systemStats.staffByRole.activeDrivers} active)</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-dashboard-bg rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-dashboard-accent"></div>
              <span className="text-xs sm:text-sm text-dashboard-text-primary">Driver Assistants</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-dashboard-text-primary">{systemStats.staffByRole.assistants}</div>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-dashboard-bg rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-secondary-purple"></div>
              <span className="text-xs sm:text-sm text-dashboard-text-primary">Store Managers</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-dashboard-text-primary">{systemStats.staffByRole.storeManagers}</div>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-dashboard-bg rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-status-in-transit"></div>
              <span className="text-xs sm:text-sm text-dashboard-text-primary">Warehouse Staff</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-dashboard-text-primary">{systemStats.staffByRole.warehouseStaff}</div>
          </div>
          
          <div className="flex justify-between items-center p-2 bg-dashboard-bg rounded">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-primary-turquoise"></div>
              <span className="text-xs sm:text-sm text-dashboard-text-primary">Management</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-dashboard-text-primary">{systemStats.staffByRole.management}</div>
          </div>
        </div>
      </div>

      {/* Operational Metrics */}
      <div className="mb-4 sm:mb-6">
        <h4 className="text-sm font-semibold text-dashboard-text-primary mb-3">Operational Readiness</h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg">
            <div className="text-xs text-dashboard-text-secondary mb-1">Stores Active</div>
            <div className="text-base sm:text-lg font-bold text-dashboard-text-primary">{systemStats.operationalMetrics.totalStores}</div>
          </div>
          
          <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg">
            <div className="text-xs text-dashboard-text-secondary mb-1">Available Trucks</div>
            <div className="text-base sm:text-lg font-bold text-dashboard-text-primary">
              {systemStats.operationalMetrics.availableTrucks}/{systemStats.operationalMetrics.totalTrucks}
            </div>
          </div>
          
          <div className="bg-dashboard-bg p-2 sm:p-3 rounded-lg col-span-2">
            <div className="text-xs text-dashboard-text-secondary mb-1">Active Routes Today</div>
            <div className="text-base sm:text-lg font-bold text-primary-coral">{systemStats.operationalMetrics.activeRoutes}</div>
          </div>
        </div>
      </div>

      {/* Recent Staff Activity */}
      <div className="flex-1">
        <h4 className="text-sm font-semibold text-dashboard-text-primary mb-3">Recent Staff</h4>
        <div className="space-y-2">
          {recentStaff.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-dashboard-text-secondary text-sm">
              No staff members found
            </div>
          ) : (
            recentStaff.map((staff: StaffMember, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-dashboard-bg rounded-lg transition-colors">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <UserAvatar
                    src={staff.avatar}
                    name={staff.name}
                    size="sm"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-dashboard-text-primary truncate">{staff.name}</p>
                    <p className="text-xs text-dashboard-text-secondary truncate">{staff.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-status-delivered' : 'bg-status-cancelled'}`}></div>
                  <span className="text-xs text-dashboard-text-secondary capitalize">{staff.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
