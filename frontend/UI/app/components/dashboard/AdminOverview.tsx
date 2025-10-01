
import React from 'react';
import UserAvatar from '../UserAvatar';

interface AdminData {
  name: string;
  role: string;
  id: string;
  avatar?: string | null;
  status: 'active' | 'offline';
}

const AdminOverview: React.FC = () => {
  const adminData: AdminData[] = [
    {
      name: 'Surath Perera',
      role: 'Driver Assistant',
      id: '1234567',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', // Sample avatar
      status: 'active'
    },
    {
      name: 'Aruna Shantha',
      role: 'Driver Assistant', 
      id: '1234568',
      avatar: null, // Will show initials "AS"
      status: 'active'
    },
    {
      name: 'Surath Chandralal',
      role: 'Driver Assistant',
      id: '1234569',
      avatar: null, // Will show initials "SC"
      status: 'offline'
    },
    {
      name: 'Priya Jayawardena',
      role: 'Store Manager - Dematagoda',
      id: '1234570',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', // Sample avatar
      status: 'active'
    },
    {
      name: 'Kasun Silva',
      role: 'Store Manager - Fort',
      id: '1234571',
      avatar: null, // Will show initials "KS"
      status: 'active'
    }
  ];

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6 h-full min-h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold text-dashboard-text-primary">Admin Overview</h3>
        <button className="text-xs sm:text-sm text-dashboard-accent hover:text-primary-coral font-medium">
          View All
        </button>
      </div>
      
      {/* Admin List */}
      <div className="space-y-2 sm:space-y-4 flex-1">
        {adminData.map((admin: AdminData, index: number) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 hover:bg-dashboard-bg rounded-lg transition-colors">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <UserAvatar
                src={admin.avatar}
                name={admin.name}
                size="md"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-dashboard-text-primary truncate">{admin.name}</p>
                <p className="text-xs text-dashboard-text-secondary truncate">{admin.role}</p>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <p className="text-xs sm:text-sm font-medium text-dashboard-text-primary">{admin.id}</p>
              <div className="flex items-center justify-end space-x-1">
                <div className={`w-2 h-2 rounded-full ${admin.status === 'active' ? 'bg-status-delivered' : 'bg-status-cancelled'}`}></div>
                <span className="text-xs text-dashboard-text-secondary capitalize">{admin.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-dashboard-border">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-sm sm:text-lg font-bold text-dashboard-text-primary">12</div>
            <div className="text-xs text-dashboard-text-secondary">Total Staff</div>
          </div>
          <div>
            <div className="text-sm sm:text-lg font-bold text-status-delivered">10</div>
            <div className="text-xs text-dashboard-text-secondary">Active</div>
          </div>
          <div>
            <div className="text-sm sm:text-lg font-bold text-status-cancelled">2</div>
            <div className="text-xs text-dashboard-text-secondary">Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;