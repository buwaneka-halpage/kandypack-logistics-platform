
import React from 'react';

interface AdminData {
  name: string;
  role: string;
  id: string;
  avatar: string;
  status: 'active' | 'offline';
}

const AdminOverview: React.FC = () => {
  const adminData: AdminData[] = [
    {
      name: 'Driver Assistant',
      role: 'Surath Perera',
      id: '1234567',
      avatar: '/api/placeholder/40/40',
      status: 'active'
    },
    {
      name: 'Driver Assistant',
      role: 'Aruna Shantha',
      id: '1234567',
      avatar: '/api/placeholder/40/40',
      status: 'active'
    },
    {
      name: 'Driver Assistant',
      role: 'Surath Chandralal',
      id: '1234567',
      avatar: '/api/placeholder/40/40',
      status: 'active'
    },
    {
      name: 'Store Manager',
      role: 'Dematagoda',
      id: '1234567',
      avatar: '/api/placeholder/40/40',
      status: 'active'
    },
    {
      name: 'Store Manager',
      role: 'Fort',
      id: '1234567',
      avatar: '/api/placeholder/40/40',
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
              <img
                src={admin.avatar}
                alt={admin.role}
                className="w-10 h-10 rounded-full bg-gray-200"
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