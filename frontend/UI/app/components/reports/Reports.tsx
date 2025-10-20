import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react"; // Removed Download
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Removed Button import
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import DashboardLayout from "../dashboard/DashboardLayout";
import { ReportsAPI } from "~/services/api";

// Define colors for pie chart
const COLORS = ["#1e3a8a", "#ef4444", "#fef3c7", "#10b981", "#f59e0b", "#8b5cf6"];

// Helper to generate a list of recent years for dropdowns
const recentYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
const quarters = [1, 2, 3, 4];
const months = [
    { value: 1, name: 'Jan' }, { value: 2, name: 'Feb' }, { value: 3, name: 'Mar' },
    { value: 4, name: 'Apr' }, { value: 5, name: 'May' }, { value: 6, name: 'Jun' },
    { value: 7, name: 'Jul' }, { value: 8, name: 'Aug' }, { value: 9, name: 'Sep' },
    { value: 10, name: 'Oct' }, { value: 11, name: 'Nov' }, { value: 12, name: 'Dec' },
];

// Default date range for new reports (last 30 days)
const defaultEndDate = new Date().toISOString().split('T')[0];
const defaultStartDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];


export default function Reports() {
  // Data states
  const [quarterlySalesData, setQuarterlySalesData] = useState<any[]>([]);
  const [mostOrderedItemsData, setMostOrderedItemsData] = useState<any[]>([]);
  const [workingHoursData, setWorkingHoursData] = useState<any[]>([]);
  const [assistantHoursData, setAssistantHoursData] = useState<any[]>([]);
  const [truckUsageData, setTruckUsageData] = useState<any[]>([]);
  const [customerOrderHistoryData, setCustomerOrderHistoryData] = useState<any[]>([]);
  const [salesByCityData, setSalesByCityData] = useState<any[]>([]);
  const [salesByRouteData, setSalesByRouteData] = useState<any[]>([]);

  // Per-card loading states
  const [quarterlySalesLoading, setQuarterlySalesLoading] = useState(true);
  const [topItemsLoading, setTopItemsLoading] = useState(true);
  const [workingHoursLoading, setWorkingHoursLoading] = useState(true);
  const [assistantHoursLoading, setAssistantHoursLoading] = useState(true);
  const [truckUsageLoading, setTruckUsageLoading] = useState(true);
  const [customerOrdersLoading, setCustomerOrdersLoading] = useState(true);
  const [salesByCityLoading, setSalesByCityLoading] = useState(true);
  const [salesByRouteLoading, setSalesByRouteLoading] = useState(true);

  // Filter states
  const [topItemsFilters, setTopItemsFilters] = useState({ year: new Date().getFullYear(), quarter: Math.floor((new Date().getMonth() + 3) / 3) });
  const [workingHoursFilters, setWorkingHoursFilters] = useState({ startDate: defaultStartDate, endDate: defaultEndDate });
  const [assistantHoursFilters, setAssistantHoursFilters] = useState({ startDate: defaultStartDate, endDate: defaultEndDate });
  const [truckUsageFilters, setTruckUsageFilters] = useState({ year: new Date().getFullYear(), month: new Date().getMonth() + 1 });
  const [customerOrdersFilters, setCustomerOrdersFilters] = useState({ customerId: 'C000001', startDate: defaultStartDate, endDate: defaultEndDate });
  const [salesByCityFilters, setSalesByCityFilters] = useState({ startDate: defaultStartDate, endDate: defaultEndDate });
  const [salesByRouteFilters, setSalesByRouteFilters] = useState({ startDate: defaultStartDate, endDate: defaultEndDate });
  
  const [error, setError] = useState<string | null>(null);

  // --- Data Fetching Effects ---

  // Fetch Quarterly Sales (runs once on mount)
  useEffect(() => {
    async function fetchQuarterlySales() {
      setQuarterlySalesLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const salesPromises = [1, 2, 3, 4].map(q => ReportsAPI.quarterlySales(currentYear, q).catch(() => [{ total_sales_value: 0 }]));
        const quarterlyResults = await Promise.all(salesPromises);
        
        const formattedData = quarterlyResults.map((result, index) => ({
            quarter: `Q${index + 1}`,
            sales: result[0].total_sales_value,
        }));
        setQuarterlySalesData(formattedData);
      } catch (err) {
        console.error("Error fetching quarterly sales:", err);
        setError("Failed to load quarterly sales data.");
      } finally {
        setQuarterlySalesLoading(false);
      }
    }
    fetchQuarterlySales();
  }, []);

  // Fetch Top Items (runs when filters change)
  useEffect(() => {
    async function fetchTopItems() {
      setTopItemsLoading(true);
      try {
        const topItems = await ReportsAPI.topItems(topItemsFilters.year, topItemsFilters.quarter, 6);
        setMostOrderedItemsData(topItems.map((item: any, index: number) => ({
          name: item.product_name,
          value: item.total_quantity,
          color: COLORS[index % COLORS.length]
        })));
      } catch (err) {
        console.error("Error fetching top items:", err);
        setMostOrderedItemsData([]); // Clear data on error
      } finally {
        setTopItemsLoading(false);
      }
    }
    fetchTopItems();
  }, [topItemsFilters]);

  // Fetch Driver Hours (runs when filters change)
  useEffect(() => {
    async function fetchDriverHours() {
        setWorkingHoursLoading(true);
        try {
            const driverHours = await ReportsAPI.driverHours(workingHoursFilters.startDate, workingHoursFilters.endDate);
            setWorkingHoursData(driverHours.map((item: any) => ({
                name: item.name,
                hours: parseFloat((item.total_duration / 60).toFixed(1)) // Convert minutes to hours
            })));
        } catch (err) {
            console.error("Error fetching driver hours:", err);
            setWorkingHoursData([]);
        } finally {
            setWorkingHoursLoading(false);
        }
    }
    if (workingHoursFilters.startDate && workingHoursFilters.endDate) {
        fetchDriverHours();
    }
  }, [workingHoursFilters]);

  // Fetch Assistant Hours
  useEffect(() => {
    async function fetchAssistantHours() {
        setAssistantHoursLoading(true);
        try {
            const assistantHours = await ReportsAPI.assistantHours(assistantHoursFilters.startDate, assistantHoursFilters.endDate);
            setAssistantHoursData(assistantHours.map((item: any) => ({
                name: item.name,
                hours: parseFloat((item.total_duration / 60).toFixed(1)) // Convert minutes to hours
            })));
        } catch (err) {
            console.error("Error fetching assistant hours:", err);
            setAssistantHoursData([]);
        } finally {
            setAssistantHoursLoading(false);
        }
    }
    if (assistantHoursFilters.startDate && assistantHoursFilters.endDate) {
        fetchAssistantHours();
    }
  }, [assistantHoursFilters]);

  // Fetch Truck Usage (runs when filters change)
  useEffect(() => {
    async function fetchTruckUsage() {
        setTruckUsageLoading(true);
        try {
            const truckUsage = await ReportsAPI.truckUsage(truckUsageFilters.year, truckUsageFilters.month);
            setTruckUsageData(truckUsage.map((item: any) => ({
                name: item.license_num,
                trips: item.trips
            })));
        } catch (err) {
            console.error("Error fetching truck usage:", err);
            setTruckUsageData([]);
        } finally {
            setTruckUsageLoading(false);
        }
    }
    fetchTruckUsage();
  }, [truckUsageFilters]);
  
  // Fetch Customer Orders (runs when filters change)
  useEffect(() => {
    async function fetchCustomerOrders() {
        setCustomerOrdersLoading(true);
        try {
            const customerOrders = await ReportsAPI.customerOrders(customerOrdersFilters.customerId, customerOrdersFilters.startDate, customerOrdersFilters.endDate);
            setCustomerOrderHistoryData(customerOrders.slice(0, 5).map((item: any) => ({
                orderId: item.order_id,
                status: item.status
            })));
        } catch (err) {
            console.error("Error fetching customer orders:", err);
            setCustomerOrderHistoryData([]);
        } finally {
            setCustomerOrdersLoading(false);
        }
    }
    if (customerOrdersFilters.customerId && customerOrdersFilters.startDate && customerOrdersFilters.endDate) {
        fetchCustomerOrders();
    }
  }, [customerOrdersFilters]);

  // Fetch Sales by City
  useEffect(() => {
    async function fetchSalesByCity() {
        setSalesByCityLoading(true);
        try {
            const salesByCity = await ReportsAPI.salesByCity(salesByCityFilters.startDate, salesByCityFilters.endDate);
            setSalesByCityData(salesByCity.map((item: any) => ({
                name: item.city_name,
                sales: item.sales_value
            })));
        } catch (err) {
            console.error("Error fetching sales by city:", err);
            setSalesByCityData([]);
        } finally {
            setSalesByCityLoading(false);
        }
    }
    if (salesByCityFilters.startDate && salesByCityFilters.endDate) {
        fetchSalesByCity();
    }
  }, [salesByCityFilters]);

  // Fetch Sales by Route
  useEffect(() => {
    async function fetchSalesByRoute() {
        setSalesByRouteLoading(true);
        try {
            const salesByRoute = await ReportsAPI.salesByRoute(salesByRouteFilters.startDate, salesByRouteFilters.endDate);
            setSalesByRouteData(salesByRoute.slice(0, 5).map((item: any) => ({ // Show top 5
              routeId: item.route_id,
              salesValue: item.sales_value,
              orderCount: item.order_count
            })));
        } catch (err) {
            console.error("Error fetching sales by route:", err);
            setSalesByRouteData([]);
        } finally {
            setSalesByRouteLoading(false);
        }
    }
    if (salesByRouteFilters.startDate && salesByRouteFilters.endDate) {
        fetchSalesByRoute();
    }
  }, [salesByRouteFilters]);


  const handleFilterChange = (setter: Function, filters: object, newValues: object) => {
    setter({ ...filters, ...newValues });
  };
  
  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {error && <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">{error}</div>}
        
        {/* First Row - Quarterly Sales, Most Ordered Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quarterly Sales Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Quarterly Sales Report</h2>
              {/* Download Button Removed */}
            </div>
            {quarterlySalesLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={quarterlySalesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="quarter" tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="sales" stroke="#1e3a8a" strokeWidth={2} dot={{ fill: '#1e3a8a', r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            )}
          </div>

          {/* Most Ordered Items */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Most Ordered Items</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm">
                <select value={topItemsFilters.year} onChange={(e) => handleFilterChange(setTopItemsFilters, topItemsFilters, { year: parseInt(e.target.value) })} className="p-1 border rounded-md bg-gray-50 text-xs">
                    {recentYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <select value={topItemsFilters.quarter} onChange={(e) => handleFilterChange(setTopItemsFilters, topItemsFilters, { quarter: parseInt(e.target.value) })} className="p-1 border rounded-md bg-gray-50 text-xs">
                    {quarters.map(q => <option key={q} value={q}>Q{q}</option>)}
                </select>
            </div>
            {topItemsLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie data={mostOrderedItemsData} cx="50%" cy="50%" innerRadius={40} outerRadius={80} paddingAngle={5} dataKey="value">
                            {mostOrderedItemsData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            )}
            <div className="mt-4 space-y-2">
              {mostOrderedItemsData.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-gray-700">{item.name}</span>
                  <span className="ml-auto text-gray-600">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second Row - Working Hours (Driver, Assistant), Truck Usage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Driver Working Hours Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Driver Working Hours</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs">
                <input type="date" value={workingHoursFilters.startDate} onChange={(e) => handleFilterChange(setWorkingHoursFilters, workingHoursFilters, { startDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
                <span>-</span>
                <input type="date" value={workingHoursFilters.endDate} onChange={(e) => handleFilterChange(setWorkingHoursFilters, workingHoursFilters, { endDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
            </div>
            {workingHoursLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={workingHoursData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 11 }}/>
                        <Tooltip />
                        <Bar dataKey="hours" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
          </div>

          {/* Assistant Working Hours Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Assistant Working Hours</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs">
                <input type="date" value={assistantHoursFilters.startDate} onChange={(e) => handleFilterChange(setAssistantHoursFilters, assistantHoursFilters, { startDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
                <span>-</span>
                <input type="date" value={assistantHoursFilters.endDate} onChange={(e) => handleFilterChange(setAssistantHoursFilters, assistantHoursFilters, { endDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
            </div>
            {assistantHoursLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={assistantHoursData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fontSize: 11 }}/>
                        <Tooltip />
                        <Bar dataKey="hours" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
          </div>

          {/* Truck Usage Analysis */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Truck Usage Analysis</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-sm">
                <select value={truckUsageFilters.year} onChange={(e) => handleFilterChange(setTruckUsageFilters, truckUsageFilters, { year: parseInt(e.target.value) })} className="p-1 border rounded-md bg-gray-50 text-xs">
                    {recentYears.map(year => <option key={year} value={year}>{year}</option>)}
                </select>
                <select value={truckUsageFilters.month} onChange={(e) => handleFilterChange(setTruckUsageFilters, truckUsageFilters, { month: parseInt(e.target.value) })} className="p-1 border rounded-md bg-gray-50 text-xs">
                    {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
                </select>
            </div>
            {truckUsageLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={truckUsageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} label={{ value: 'Number of Trips', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="trips" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Third Row - Sales by City, Sales by Route, Customer Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales by City Report */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Sales by City</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs">
                <input type="date" value={salesByCityFilters.startDate} onChange={(e) => handleFilterChange(setSalesByCityFilters, salesByCityFilters, { startDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
                <span>-</span>
                <input type="date" value={salesByCityFilters.endDate} onChange={(e) => handleFilterChange(setSalesByCityFilters, salesByCityFilters, { endDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
            </div>
            {salesByCityLoading ? (
                <div className="h-[200px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={salesByCityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={{ stroke: '#e5e7eb' }} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={{ stroke: '#e5e7eb' }} label={{ value: 'Sales', angle: -90, position: 'insideLeft', fontSize: 11 }}/>
                        <Tooltip />
                        <Bar dataKey="sales" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
          </div>

          {/* Sales by Route */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Sales by Route</h2>
              {/* Download Button Removed */}
            </div>
            <div className="flex items-center gap-2 mb-4 text-xs">
                <input type="date" value={salesByRouteFilters.startDate} onChange={(e) => handleFilterChange(setSalesByRouteFilters, salesByRouteFilters, { startDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
                <span>-</span>
                <input type="date" value={salesByRouteFilters.endDate} onChange={(e) => handleFilterChange(setSalesByRouteFilters, salesByRouteFilters, { endDate: e.target.value })} className="p-1 border rounded-md bg-gray-50"/>
            </div>
            {salesByRouteLoading ? (
                 <div className="h-[180px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <div className="overflow-auto rounded-lg border border-gray-200" style={{maxHeight: '210px'}}>
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow>
                        <TableHead className="font-semibold text-gray-700 text-sm">Route ID</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-sm">Sales</TableHead>
                        <TableHead className="font-semibold text-gray-700 text-sm">Orders</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesByRouteData.length > 0 ? salesByRouteData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium text-gray-900 text-sm truncate" style={{maxWidth: '100px'}} title={item.routeId}>{item.routeId}</TableCell>
                          <TableCell className="text-gray-700 text-sm">{item.salesValue}</TableCell>
                          <TableCell className="text-gray-700 text-sm">{item.orderCount}</TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={3} className="text-center text-sm text-gray-500">No data found.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </div>

          {/* Customer Order History */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-gray-900">Customer Order History</h2>
              {/* Download Button Removed */}
            </div>
             <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
                <input type="text" placeholder="Customer ID" value={customerOrdersFilters.customerId} onChange={(e) => handleFilterChange(setCustomerOrdersFilters, customerOrdersFilters, { customerId: e.target.value })} className="p-1 border rounded-md bg-gray-50 w-full"/>
                <div className="flex items-center gap-2">
                    <input type="date" value={customerOrdersFilters.startDate} onChange={(e) => handleFilterChange(setCustomerOrdersFilters, customerOrdersFilters, { startDate: e.target.value })} className="p-1 border rounded-md bg-gray-50 w-full"/>
                    <input type="date" value={customerOrdersFilters.endDate} onChange={(e) => handleFilterChange(setCustomerOrdersFilters, customerOrdersFilters, { endDate: e.target.value })} className="p-1 border rounded-md bg-gray-50 w-full"/>
                </div>
            </div>
            {customerOrdersLoading ? (
                 <div className="h-[180px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-blue-600" /></div>
            ) : (
                <div className="overflow-auto rounded-lg border border-gray-200" style={{maxHeight: '210px'}}>
                  <Table>
                    <TableHeader className="bg-gray-50 sticky top-0">
                      <TableRow><TableHead className="font-semibold text-gray-700 text-sm">OrderID</TableHead><TableHead className="font-semibold text-gray-700 text-sm">Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerOrderHistoryData.length > 0 ? customerOrderHistoryData.map((order, index) => (
                        <TableRow key={index}><TableCell className="font-medium text-gray-900 text-sm">{order.orderId}</TableCell><TableCell className="text-gray-700 text-sm">{order.status}</TableCell></TableRow>

                      )) : (
                        <TableRow><TableCell colSpan={2} className="text-center text-sm text-gray-500">No orders found.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}