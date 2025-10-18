import { Package, Clock, Calendar } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export default function CustomerHome() {
  // Mock data for active orders
  const activeOrders = [
    {
      id: "#00001",
      items:
        "Detergent Powder , Big Bottle of Family Pack , The Box of Chocolate",
      total: 7500.0,
      deliveryDate: "Sep 25, 10:30 AM",
    },
    {
      id: "#00020",
      items: "Detergent Powder , Big Bottle of Sunflower Oil , 9kg",
      total: 5000.0,
      deliveryDate: "N/A",
    },
  ];

  // Mock data for delivered orders
  const deliveredOrders = [
    {
      id: "#00005",
      items:
        "Detergent Powder , Big Bottle of Family Pack , The Box of Chocolate",
      total: 7500.0,
    },
    {
      id: "#00006",
      items: "Detergent Powder , Big Bottle of Sunflower Oil , 9kg",
      total: 5000.0,
    },
    {
      id: "#00007",
      items:
        "Detergent Powder , Big Bottle of Family Pack , The Box of Chocolate",
      total: 7500.0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-[#5D5FEF] rounded-lg flex items-center justify-center">
          <span className="text-white text-xl">👋</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#282F4E]">
          Welcome Back, User123!
        </h1>
      </div>

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
            <p className="text-3xl font-bold text-[#282F4E]">2</p>
          </div>
        </Card>

        {/* Delivered Orders Card */}
        <Card className="p-6 bg-white border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-gray-600 text-sm">Delivered Orders</p>
            <p className="text-3xl font-bold text-[#282F4E]">7</p>
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
            <p className="text-xl font-bold text-[#282F4E]">Sep 25, 10:30 AM</p>
          </div>
        </Card>
      </div>

      {/* Active Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#282F4E]">
            Active Orders
          </h2>
          <button className="text-[#5D5FEF] hover:underline text-sm font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OrderID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Delivery ETA
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{order.items}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {order.total.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {order.deliveryDate}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delivered Orders Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[#282F4E]">
            Delivered Orders
          </h2>
          <button className="text-[#5D5FEF] hover:underline text-sm font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  OrderID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deliveredOrders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{order.items}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {order.total.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
