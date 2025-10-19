import * as React from "react";
import { useState, useEffect } from "react";
import { Download, Loader2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import DashboardLayout from "../dashboard/DashboardLayout";
import ReportsMap from "./ReportsMap";
import { ReportsAPI } from "~/services/api";

// Define colors for pie chart
const COLORS = ["#1e3a8a", "#ef4444", "#fef3c7", "#10b981", "#f59e0b", "#8b5cf6"];

export default function Reports() {
  const [quarterlySalesData, setQuarterlySalesData] = useState<any[]>([]);
  const [mostOrderedItemsData, setMostOrderedItemsData] = useState<any[]>([]);
  const [workingHoursData, setWorkingHoursData] = useState<any[]>([]);
  const [truckUsageData, setTruckUsageData] = useState<any[]>([]);
  const [customerOrderHistoryData, setCustomerOrderHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all reports data
  useEffect(() => {
    async function fetchReportsData() {
      try {
        setLoading(true);
        
        const [
          quarterlySales,
          topItems,
          driverHours,
          truckUsage,
          customerOrders
        ] = await Promise.all([
          ReportsAPI.quarterlySales().catch(() => []),
          ReportsAPI.topItems().catch(() => []),
          ReportsAPI.driverHours().catch(() => []),
          ReportsAPI.truckUsage().catch(() => []),
          ReportsAPI.customerOrders("C000001").catch(() => []) // TODO: Use actual customer ID
        ]);
        
        // Transform quarterly sales data
        setQuarterlySalesData(quarterlySales.map((item: any) => ({
          quarter: `Q${item.quarter}`,
          sales: item.total_sales
        })));
        
        // Transform top items data for pie chart
        setMostOrderedItemsData(topItems.map((item: any, index: number) => ({
          name: item.product_name,
          value: item.total_quantity,
          color: COLORS[index % COLORS.length]
        })));
        
        // Transform driver hours data
        setWorkingHoursData(driverHours.map((item: any) => ({
          name: item.driver_name,
          hours: item.total_hours
        })));
        
        // Transform truck usage data
        setTruckUsageData(truckUsage.map((item: any) => ({
          date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          trips: item.trip_count
        })));
        
        // Transform customer orders data
        setCustomerOrderHistoryData(customerOrders.slice(0, 4).map((item: any) => ({
          orderId: item.order_id,
          status: item.status
        })));
        
        setError(null);
      } catch (err) {
        console.error("Error fetching reports data:", err);
        setError("Failed to load reports data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchReportsData();
  }, []);
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading reports...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
        {/* First Row - Quarterly Sales, Most Ordered Items, Sales Breakdown Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quarterly Sales Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Quarterly Sales Report</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={quarterlySalesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="quarter" 
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Sales', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#1e3a8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e3a8a', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Most Ordered Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Most Ordered Items</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mostOrderedItemsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mostOrderedItemsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {mostOrderedItemsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-700">{item.name}</span>
                  <span className="ml-auto text-gray-600">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Breakdown Map */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Sales Breakdown</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <div className="h-[300px] rounded-lg overflow-hidden">
              <ReportsMap />
            </div>
          </div>
        </div>

        {/* Second Row - Working Hours, Truck Usage, Customer Order History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Working Hours Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Working Hours Report</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={workingHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip />
                <Bar dataKey="hours" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Truck Usage Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Truck Usage Analysis</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={truckUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tick={{ fontSize: 11 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Number of Trips', angle: -90, position: 'insideLeft', fontSize: 10 }}
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#1e3a8a" 
                  strokeWidth={2}
                  dot={{ fill: '#1e3a8a', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Order History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Customer Order History</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4 text-gray-600" />
              </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700 text-sm">OrderID</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-sm">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrderHistoryData.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium text-gray-900 text-sm">
                        {order.orderId}
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">
                        {order.status}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </DashboardLayout>
  );
}
