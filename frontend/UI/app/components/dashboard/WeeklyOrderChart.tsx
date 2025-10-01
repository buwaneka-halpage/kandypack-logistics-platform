import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, AlertCircle } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from '~/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '~/components/ui/chart';

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

  // Chart configuration for the UI component
  const chartConfig = {
    value: {
      label: selectedMetric === 'orders' ? 'Orders' : 'Revenue',
      color: 'oklch(0.72 0.15 25)', // dashboard accent color
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <CardTitle>Weekly Order Analysis</CardTitle>
              {isUsingDummyData && (
                <div className="flex items-center space-x-1 px-2 py-1 bg-status-shipped text-dashboard-text-primary rounded text-xs w-fit">
                  <AlertCircle className="w-3 h-3" />
                  <span>Demo Data</span>
                </div>
              )}
            </div>
            <CardDescription className="mt-1">
              Track {selectedMetric === 'orders' ? 'order volume' : 'revenue'} trends across the selected period
            </CardDescription>
          </div>
          
          <CardAction>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Metric Toggle */}
              <div className="flex bg-dashboard-bg rounded-lg p-1 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedMetric('orders')}
                  className={`flex-1 sm:flex-none px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedMetric === 'orders'
                      ? 'bg-dashboard-white text-dashboard-accent shadow-sm'
                      : 'text-dashboard-text-secondary hover:text-dashboard-text-primary'
                  }`}
                >
                  Orders
                </button>
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`flex-1 sm:flex-none px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    selectedMetric === 'revenue'
                      ? 'bg-dashboard-white text-dashboard-accent shadow-sm'
                      : 'text-dashboard-text-secondary hover:text-dashboard-text-primary'
                  }`}
                >
                  Revenue
                </button>
              </div>
              
              {/* Period Selector */}
              <div className="relative period-dropdown w-full sm:w-auto">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center justify-between w-full sm:w-auto space-x-2 px-3 py-2 border border-dashboard-border rounded-lg text-sm hover:bg-dashboard-bg"
                >
                  <span>{selectedPeriod}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 sm:right-0 left-0 sm:left-auto mt-2 w-full sm:w-48 bg-dashboard-white border border-dashboard-border rounded-lg shadow-lg z-10">
                    {periodOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          handlePeriodChange(option);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-dashboard-bg first:rounded-t-lg last:rounded-b-lg ${
                          option === selectedPeriod ? 'bg-dashboard-accent text-dashboard-white' : 'text-dashboard-text-primary'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardAction>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          // Loading State
          <div className="flex items-center justify-center h-80 w-full">
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-accent"></div>
              <p className="text-sm text-dashboard-text-secondary">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full px-4">
            <ChartContainer config={chartConfig} className="h-80 w-full max-w-5xl mx-auto min-w-0">
              <AreaChart
                data={currentData}
                margin={{
                  left: 10,
                  right: 10,
                  top: 20,
                  bottom: 5,
                }}
              >
              <defs>
                <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" />
              
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                height={60}
                interval={0}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={60}
                tickFormatter={(value) => 
                  selectedMetric === 'orders' 
                    ? `${value}` 
                    : `$${(value / 1000).toFixed(0)}K`
                }
              />
              
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      selectedMetric === 'orders' 
                        ? `${value} orders`
                        : `$${Number(value).toLocaleString()}`,
                      selectedMetric === 'orders' ? 'Orders' : 'Revenue'
                    ]}
                    labelFormatter={(label) => label}
                  />
                }
              />
              
              <Area
                dataKey="value"
                type="monotone"
                fill="url(#fillGradient)"
                fillOpacity={1}
                stroke="var(--color-value)"
                strokeWidth={3}
                dot={{
                  fill: "var(--color-value)",
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                }}
              />
              </AreaChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>      {/* Summary Stats */}
      <CardContent className="pt-0">
        <div className="pt-4 border-t border-dashboard-border">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-4 h-4 text-dashboard-accent" />
                <span className="text-lg font-bold text-dashboard-text-primary">
                  {selectedMetric === 'orders' 
                    ? Math.max(...currentData.map(d => d.value))
                    : `$${Math.max(...currentData.map(d => d.value)).toLocaleString()}`
                  }
                </span>
              </div>
              <div className="text-xs text-dashboard-text-secondary">Peak {selectedMetric === 'orders' ? 'Orders' : 'Revenue'}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dashboard-text-primary">
                {selectedMetric === 'orders' 
                  ? Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length)
                  : `$${Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length).toLocaleString()}`
                }
              </div>
              <div className="text-xs text-dashboard-text-secondary">Daily Average</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-dashboard-text-primary">
                {selectedMetric === 'orders' 
                  ? currentData.reduce((sum, d) => sum + d.value, 0)
                  : `$${currentData.reduce((sum, d) => sum + d.value, 0).toLocaleString()}`
                }
              </div>
              <div className="text-xs text-dashboard-text-secondary">Total This Week</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyOrderChart;