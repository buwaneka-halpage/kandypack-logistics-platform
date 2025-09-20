import { Package, Truck, CheckCircle, Clock, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  {
    name: "Total Orders",
    value: "1,247",
    change: "+12%",
    changeType: "increase",
    icon: Package,
    color: "dashboard-info",
  },
  {
    name: "Active Shipments",
    value: "89",
    change: "+5",
    changeType: "increase",
    icon: Truck,
    color: "dashboard-warning",
  },
  {
    name: "Delivered Today",
    value: "156",
    change: "+23%",
    changeType: "increase",
    icon: CheckCircle,
    color: "dashboard-success",
  },
  {
    name: "Pending Orders",
    value: "34",
    change: "-8%",
    changeType: "decrease",
    icon: Clock,
    color: "dashboard-accent",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="dashboard-card">
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${stat.color} p-3 rounded-lg`}>
              <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className="flex items-center">
                  {stat.changeType === "increase" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span
                    className={`ml-1 text-sm font-medium ${
                      stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}