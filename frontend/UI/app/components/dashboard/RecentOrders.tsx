import { Eye, MoreVertical } from "lucide-react";

const recentOrders = [
  {
    id: "ORD-001",
    customer: "Acme Corp",
    destination: "New York, NY",
    status: "shipped",
    value: "$2,450",
    date: "2025-09-20",
  },
  {
    id: "ORD-002",
    customer: "TechStart Inc",
    destination: "San Francisco, CA",
    status: "pending",
    value: "$1,890",
    date: "2025-09-20",
  },
  {
    id: "ORD-003",
    customer: "Global Systems",
    destination: "Chicago, IL",
    status: "delivered",
    value: "$3,200",
    date: "2025-09-19",
  },
  {
    id: "ORD-004",
    customer: "MegaCorp Ltd",
    destination: "Miami, FL",
    status: "shipped",
    value: "$1,650",
    date: "2025-09-19",
  },
  {
    id: "ORD-005",
    customer: "StartUp Co",
    destination: "Austin, TX",
    status: "pending",
    value: "$980",
    date: "2025-09-18",
  },
];

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "shipped":
      return "status-shipped";
    case "pending":
      return "status-pending";
    case "delivered":
      return "status-delivered";
    case "cancelled":
      return "status-cancelled";
    default:
      return "dashboard-info";
  }
}

export function RecentOrders() {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        <a
          href="/orders"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all
        </a>
      </div>
      
      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{order.id}</span>
                <span
                  className={`${getStatusClass(order.status)} px-2 py-1 rounded-full text-xs font-medium`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{order.customer}</p>
              <p className="text-xs text-gray-500">{order.destination}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{order.value}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Eye className="h-4 w-4" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-gray-600 hover:text-gray-900 font-medium">
          Load more orders
        </button>
      </div>
    </div>
  );
}