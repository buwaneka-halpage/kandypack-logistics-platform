import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, AlertCircle } from 'lucide-react';

interface ChartDataPoint {
  day: string;
  orders: number;
  revenue: number;
}

interface WeeklyData {
  [key: string]: ChartDataPoint[];
}

const WeeklyOrderChart: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('This Week');
  const [selectedMetric, setSelectedMetric] = useState<'orders' | 'revenue'>('orders');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUsingDummyData, setIsUsingDummyData] = useState<boolean>(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  
  // Comprehensive dummy data for different time periods
  const dummyData: WeeklyData = {
    'This Week': [
      { day: 'Mon', orders: 145, revenue: 25000 },
      { day: 'Tue', orders: 125, revenue: 22000 },
      { day: 'Wed', orders: 180, revenue: 32000 },
      { day: 'Thu', orders: 135, revenue: 24000 },
      { day: 'Fri', orders: 220, revenue: 38000 },
      { day: 'Sat', orders: 190, revenue: 33000 },
      { day: 'Sun', orders: 165, revenue: 28000 }
    ],
    'Last Week': [
      { day: 'Mon', orders: 132, revenue: 23500 },
      { day: 'Tue', orders: 118, revenue: 21000 },
      { day: 'Wed', orders: 165, revenue: 29000 },
      { day: 'Thu', orders: 142, revenue: 25500 },
      { day: 'Fri', orders: 198, revenue: 35000 },
      { day: 'Sat', orders: 175, revenue: 31000 },
      { day: 'Sun', orders: 155, revenue: 27500 }
    ],
    'Last Month': [
      { day: 'Week 1', orders: 920, revenue: 165000 },
      { day: 'Week 2', orders: 1050, revenue: 189000 },
      { day: 'Week 3', orders: 1180, revenue: 212000 },
      { day: 'Week 4', orders: 1100, revenue: 198000 }
    ],
    'Last 3 Months': [
      { day: 'Month 1', orders: 4250, revenue: 764000 },
      { day: 'Month 2', orders: 4680, revenue: 842000 },
      { day: 'Month 3', orders: 5120, revenue: 921000 }
    ]
  };

  const [chartData, setChartData] = useState<ChartDataPoint[]>(dummyData['This Week']);

  // Simulate API call with fallback to dummy data
  const fetchChartData = async (period: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate API call (replace with actual backend call when ready)
      // const response = await fetch(`/api/dashboard/orders?period=${period}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setChartData(data.chartData);
      //   setIsUsingDummyData(false);
      //   return;
      // }
      
      // Fallback to dummy data when backend is not available
      console.log('Backend not available, using dummy data for period:', period);
      setChartData(dummyData[period] || dummyData['This Week']);
      setIsUsingDummyData(true);
      
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Use dummy data as fallback
      setChartData(dummyData[period] || dummyData['This Week']);
      setIsUsingDummyData(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when period changes
  useEffect(() => {
    fetchChartData(selectedPeriod);
  }, [selectedPeriod]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest('.period-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const periodOptions = ['This Week', 'Last Week', 'Last Month', 'Last 3 Months'];

  const currentData = chartData.map(d => ({ 
    day: d.day, 
    value: selectedMetric === 'orders' ? d.orders : d.revenue 
  }));
  
  const maxValue = Math.max(...currentData.map(d => d.value));
  const minValue = Math.min(...currentData.map(d => d.value));
  
  // Calculate Y-axis labels dynamically
  const getYAxisLabels = () => {
    const range = maxValue - minValue;
    const step = Math.ceil(range / 4);
    return Array.from({ length: 5 }, (_, i) => {
      const value = maxValue - (step * i);
      return selectedMetric === 'orders' ? value.toString() : `${(value / 1000).toFixed(0)}K`;
    });
  };

  const yAxisLabels = getYAxisLabels();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Order Analysis</h3>
            {isUsingDummyData && (
              <div className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>Demo Data</span>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Track {selectedMetric === 'orders' ? 'order volume' : 'revenue'} trends across the selected period
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Metric Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedMetric('orders')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                selectedMetric === 'orders'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Orders
            </button>
            <button
              onClick={() => setSelectedMetric('revenue')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                selectedMetric === 'revenue'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Revenue
            </button>
          </div>
          
          {/* Period Selector */}
          <div className="relative period-dropdown">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              <span>{selectedPeriod}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {periodOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      handlePeriodChange(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                      option === selectedPeriod ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Chart Container */}
      <div className="h-64 relative">
        {isLoading ? (
          // Loading State
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-4">
              {yAxisLabels.map((label, index) => (
                <span key={index} className="leading-none">{label}</span>
              ))}
            </div>
            
            {/* Chart Area */}
            <div className="ml-8 h-full flex items-end justify-between space-x-3">
              {currentData.map((item, index: number) => {
                const height = ((item.value - minValue) / (maxValue - minValue)) * 100;
                const isHighest = item.value === maxValue;
                
                return (
                  <div key={item.day} className="flex flex-col items-center flex-1 group">
                    {/* Value tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                      <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        {selectedMetric === 'orders' ? `${item.value} orders` : `$${item.value.toLocaleString()}`}
                      </div>
                    </div>
                    
                    {/* Bar */}
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-300 hover:opacity-80 ${
                        isHighest 
                          ? 'bg-gradient-to-t from-blue-600 to-blue-400' 
                          : 'bg-gradient-to-t from-blue-500 to-blue-300'
                      }`}
                      style={{ 
                        height: `${Math.max(height, 5)}%`,
                      }}
                    />
                    
                    {/* Day label */}
                    <span className="text-xs text-gray-600 mt-2 font-medium">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      
      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-lg font-bold text-gray-900">
                {selectedMetric === 'orders' 
                  ? Math.max(...currentData.map(d => d.value))
                  : `$${Math.max(...currentData.map(d => d.value)).toLocaleString()}`
                }
              </span>
            </div>
            <div className="text-xs text-gray-600">Peak {selectedMetric === 'orders' ? 'Orders' : 'Revenue'}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {selectedMetric === 'orders' 
                ? Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length)
                : `$${Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length).toLocaleString()}`
              }
            </div>
            <div className="text-xs text-gray-600">Daily Average</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {selectedMetric === 'orders' 
                ? currentData.reduce((sum, d) => sum + d.value, 0)
                : `$${currentData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`
              }
            </div>
            <div className="text-xs text-gray-600">Total This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOrderChart;