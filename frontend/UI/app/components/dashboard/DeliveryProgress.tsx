import React from 'react';
import { Download } from 'lucide-react';

interface DeliveryStat {
  label: string;
  value: number;
  color: string;
}

const DeliveryProgress: React.FC = () => {
  const deliveryStats: DeliveryStat[] = [
    { label: 'Ontime', value: 51, color: 'dashboard-accent' },
    { label: 'In Progress', value: 22, color: 'blue-500' },
    { label: 'Delayed', value: 27, color: 'gray-300' }
  ];

  const totalDeliveries: number = 78;

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dashboard-text-primary">Deliveries</h3>
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-dashboard-text-secondary">Rail</span>
          <span className="text-dashboard-text-secondary">Truck</span>
        </div>
      </div>
      
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="#f3f4f6"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(deliveryStats[0].value / 100) * 251.2} 251.2`}
              className="transition-all duration-500"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#ff8e8e" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalDeliveries}%</div>
              <div className="text-xs text-gray-600">Complete</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Legend */}
      <div className="space-y-3">
        {deliveryStats.map((stat: DeliveryStat, index: number) => (
          <div key={stat.label} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full bg-${stat.color}`}></div>
              <span className="text-sm text-gray-600">{stat.label}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{stat.value}%</span>
          </div>
        ))}
      </div>
      
      {/* Download Button */}
      <button className="w-full mt-6 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
        <Download className="w-4 h-4" />
        <span>Download Statistics</span>
      </button>
    </div>
  );
};

export default DeliveryProgress;
