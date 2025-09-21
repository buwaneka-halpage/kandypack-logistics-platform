import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && trendValue && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={trend === 'up' ? "M7 17l9.2-9.2M17 17V7H7" : "M17 7l-9.2 9.2M7 7h10v10"} 
                />
              </svg>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;