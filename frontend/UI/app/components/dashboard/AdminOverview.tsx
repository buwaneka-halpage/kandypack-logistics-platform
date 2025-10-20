import React, { useState, useEffect } from 'react';
import UserAvatar from '../UserAvatar';
import { DriversAPI, AssistantsAPI } from '~/services/api';

interface StaffMember {
  name: string;
  role: string;
  id: string;
  avatar?: string | null;
  status: 'active' | 'offline';
}

const AdminOverview: React.FC = () => {
  const [staffData, setStaffData] = useState<StaffMember[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    offline: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffData = async () => {
      try {
        // Fetch drivers and assistants
        const [drivers, assistants] = await Promise.all([
          DriversAPI.getAll().catch(() => []),
          AssistantsAPI.getAll().catch(() => [])
        ]);

        // Transform data to staff format
        const staffList: StaffMember[] = [
          ...(drivers || []).map((driver: any) => ({
            name: driver.name || `Driver ${driver.driver_id}`,
            role: 'Driver',
            id: driver.driver_id || '',
            avatar: null,
            status: (driver.status === 'active' ? 'active' : 'offline') as 'active' | 'offline'
          })),
          ...(assistants || []).map((assistant: any) => ({
            name: assistant.name || `Assistant ${assistant.assistant_id}`,
            role: 'Driver Assistant',
            id: assistant.assistant_id || '',
            avatar: null,
            status: 'active' as 'active' | 'offline' // Assistants don't have status field, default to active
          }))
        ];

        // Calculate stats
        const activeCount = staffList.filter(s => s.status === 'active').length;
        
        setStaffData(staffList.slice(0, 5)); // Show only first 5
        setStats({
          total: staffList.length,
          active: activeCount,
          offline: staffList.length - activeCount
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching staff data:', error);
        setLoading(false);
      }
    };

    fetchStaffData();
  }, []);

  if (loading) {
    return (
      <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex items-center justify-center">
        <div className="text-dashboard-text-secondary">Loading staff data...</div>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[600px] flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6 flex-shrink-0">
        <h3 className="text-base sm:text-lg font-semibold text-dashboard-text-primary">Admin Overview</h3>
        <button className="text-xs sm:text-sm text-dashboard-accent hover:text-primary-coral font-medium">
          View All
        </button>
      </div>
      
      {/* Staff List */}
      <div className="space-y-2 sm:space-y-4 flex-1">
        {staffData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-dashboard-text-secondary">
            No staff members found
          </div>
        ) : (
          staffData.map((staff: StaffMember, index: number) => (
            <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-dashboard-bg rounded-lg transition-colors">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <UserAvatar
                  src={staff.avatar}
                  name={staff.name}
                  size="md"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-dashboard-text-primary truncate">{staff.name}</p>
                  <p className="text-xs text-dashboard-text-secondary truncate">{staff.role}</p>
                </div>
              </div>
              
              <div className="text-right flex-shrink-0">
                <p className="text-xs sm:text-sm font-medium text-dashboard-text-primary">{staff.id}</p>
                <div className="flex items-center justify-end space-x-1">
                  <div className={`w-2 h-2 rounded-full ${staff.status === 'active' ? 'bg-status-delivered' : 'bg-status-cancelled'}`}></div>
                  <span className="text-xs text-dashboard-text-secondary capitalize">{staff.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border flex-shrink-0">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-sm sm:text-lg font-bold text-dashboard-text-primary">{stats.total}</div>
            <div className="text-xs text-dashboard-text-secondary">Total Staff</div>
          </div>
          <div>
            <div className="text-sm sm:text-lg font-bold text-status-delivered">{stats.active}</div>
            <div className="text-xs text-dashboard-text-secondary">Active</div>
          </div>
          <div>
            <div className="text-sm sm:text-lg font-bold text-status-cancelled">{stats.offline}</div>
            <div className="text-xs text-dashboard-text-secondary">Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
