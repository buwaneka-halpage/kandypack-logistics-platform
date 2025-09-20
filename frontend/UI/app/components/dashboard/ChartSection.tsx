import { BarChart3, TrendingUp } from "lucide-react";

// Mock data for the chart visualization
const chartData = [
  { name: "Mon", orders: 45, shipments: 38 },
  { name: "Tue", orders: 52, shipments: 45 },
  { name: "Wed", orders: 49, shipments: 52 },
  { name: "Thu", orders: 63, shipments: 49 },
  { name: "Fri", orders: 58, shipments: 63 },
  { name: "Sat", orders: 42, shipments: 58 },
  { name: "Sun", orders: 35, shipments: 42 },
];

export function ChartSection() {
  return (
    <div className="space-y-6">
      {/* Performance Overview Chart */}
      <div className="dashboard-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Performance Overview</h2>
          <select className="text-sm border border-gray-300 rounded-md px-3 py-1">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        
        {/* Chart Placeholder */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Orders vs Shipments Chart</p>
            <p className="text-xs text-gray-400 mt-1">Chart library integration pending</p>
          </div>
        </div>
        
        {/* Chart Legend */}
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 dashboard-chart rounded-full"></div>
            <span className="text-sm text-gray-600">Orders</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 dashboard-success rounded-full"></div>
            <span className="text-sm text-gray-600">Shipments</span>
          </div>
        </div>
      </div>
      
      {/* Quick Insights */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Delivery Performance</p>
                <p className="text-xs text-green-700">On-time delivery rate increased by 12%</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-green-600">94.2%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Average Shipping Time</p>
                <p className="text-xs text-blue-700">Reduced by 8 hours this week</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-blue-600">2.1 days</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-orange-900">Customer Satisfaction</p>
                <p className="text-xs text-orange-700">Based on recent feedback</p>
              </div>
            </div>
            <span className="text-sm font-semibold text-orange-600">4.8/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}