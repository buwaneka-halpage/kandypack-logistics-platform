import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface ChartDataPoint {
  day: string;
  value: number;
}

const WeeklyOrderChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Week');
  
  const chartData: ChartDataPoint[] = [
    { day: 'Kandy', value: 25000 },
    { day: 'Matara', value: 15000 },
    { day: 'Gampaha', value: 30000 },
    { day: 'Galle', value: 20000 },
    { day: 'Negombo', value: 35000 },
    { day: 'Colombo', value: 28000 },
    { day: 'Badulla', value: 18000 },
    { day: 'Jaffna', value: 22000 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weekly Order Volume Chart</h3>
        <div className="relative">
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
            <span>{selectedPeriod}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-64 relative">
        {/* Chart Area */}
        <div className="absolute inset-0 flex items-end justify-between space-x-2 px-4">
          {chartData.map((item: ChartDataPoint, index: number) => (
            <div key={item.day} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-dashboard-chart to-blue-200 rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '20px'
                }}
              />
              <span className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
                {item.day}
              </span>
            </div>
          ))}
        </div>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>40K</span>
          <span>30K</span>
          <span>20K</span>
          <span>10K</span>
          <span>0</span>
        </div>
      </div>
      
      {/* Chart line overlay */}
      <div className="mt-4 h-48 relative">
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 10 }}>
          <path
            d="M 50 180 Q 100 160 150 140 T 250 120 T 350 100 T 450 80 T 550 90 T 650 110 T 750 100"
            stroke="#1e293b"
            strokeWidth="2"
            fill="none"
            className="drop-shadow-sm"
          />
          {chartData.map((_: ChartDataPoint, index: number) => (
            <circle
              key={index}
              cx={50 + (index * 100)}
              cy={180 - (index * 20)}
              r="4"
              fill="#1e293b"
              className="drop-shadow-sm"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WeeklyOrderChart;