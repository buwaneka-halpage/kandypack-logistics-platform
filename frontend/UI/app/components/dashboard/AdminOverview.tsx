
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Admin Overview</h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All
        </button>
      </div>
      
      {/* Admin List */}
      <div className="space-y-4">
        {adminData.map((admin: AdminData, index: number) => (
          <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <UserAvatar
                src={admin.avatar}
                name={admin.name}
                size="md"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{admin.name}</p>
                <p className="text-xs text-gray-600">{admin.role}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{admin.id}</p>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${admin.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-gray-600 capitalize">{admin.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Total Staff</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">10</div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-600">2</div>
            <div className="text-xs text-gray-600">Offline</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;