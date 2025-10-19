import { Package, Clock, Calendar, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { OrdersAPI } from "~/services/api";

// TypeScript interface for Order
interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  deliver_address: string;
  deliver_city: string;
  full_price: number;
  status: string;
}

export default function CustomerHome() {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("User");

  // Fetch orders from API
  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersData = await OrdersAPI.getAll();
        
        // TODO: Filter by actual logged-in customer ID
        // For now, we'll show all orders but split by status
        
        // Active orders: not DELIVERED or FAILED
        const active = ordersData.filter((order: Order) => 
          order.status !== "DELIVERED" && order.status !== "FAILED"
        );
        setActiveOrders(active);
        
        // Delivered orders: status is DELIVERED
        const delivered = ordersData.filter((order: Order) => 
          order.status === "DELIVERED"
        );
        setDeliveredOrders(delivered);
        
        setError(null);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get next delivery ETA from active orders
  const nextDeliveryETA = activeOrders.length > 0 
    ? formatDate(activeOrders[0].order_date)
    : "N/A";

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#5D5FEF] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">👋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#282F4E]">
          Welcome Back, {customerName}!
        </h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#5D5FEF]" />
          <span className="ml-2 text-gray-600">Loading your orders...</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-red-600">{error}</p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Active Orders Card */}
            <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">Active Orders</p>
                <p className="text-3xl font-bold text-[#282F4E]">{activeOrders.length}</p>
              </div>
            </Card>

            {/* Delivered Orders Card */}
            <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">Delivered Orders</p>
                <p className="text-3xl font-bold text-[#282F4E]">{deliveredOrders.length}</p>
              </div>
            </Card>

            {/* Next Delivery ETA Card */}
            <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">Next Delivery ETA</p>
                <p className="text-xl font-bold text-[#282F4E]">{nextDeliveryETA}</p>
              </div>
            </Card>
          </div>
        </>
      )}

      {!loading && !error && (
        <>
          {/* Active Orders Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#282F4E]">Active Orders</h2>
              <button className="text-[#5D5FEF] hover:underline text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              {activeOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No active orders
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        OrderID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeOrders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{order.order_id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{order.deliver_address}, {order.deliver_city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">Rs. {order.full_price.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={order.status === "SCHEDULED_RAIL" ? "default" : "secondary"}>
                            {order.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{formatDate(order.order_date)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Delivered Orders Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-[#282F4E]">Delivered Orders</h2>
              <button className="text-[#5D5FEF] hover:underline text-sm font-medium">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              {deliveredOrders.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No delivered orders yet
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        OrderID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {deliveredOrders.map((order) => (
                      <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">{order.order_id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{order.deliver_address}, {order.deliver_city}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">Rs. {order.full_price.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{formatDate(order.order_date)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
