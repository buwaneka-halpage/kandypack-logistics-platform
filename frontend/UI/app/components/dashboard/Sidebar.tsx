import { BarChart3, Calendar, Package, Truck, Users, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navItems = [
    { icon: BarChart3, label: "Dashboard", isActive: true },
    { icon: Package, label: "Order Management" },
    { icon: Calendar, label: "Rail Scheduling" },
    { icon: Truck, label: "Last-Mile Delivery" },
    { icon: Package, label: "Store Management" },
    { icon: Users, label: "Admin Management" },
    { icon: Truck, label: "Router Management" },
    { icon: BarChart3, label: "Reports" },
    { icon: Package, label: "Activity Logs" },
  ];

  return (
    <aside className={`bg-primary-navy text-dashboard-white min-h-screen transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and Toggle */}
        <div className="flex items-center justify-between p-6 border-b border-dashboard-border">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-2'}`}>
            <Package className="w-8 h-8 text-dashboard-accent flex-shrink-0" />
            {!isCollapsed && (
              <h1 className="text-xl font-bold">
                Kandy<span className="text-dashboard-accent">Pack</span>
              </h1>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="text-dashboard-text-secondary hover:text-dashboard-white transition-colors p-1 rounded"
              aria-label="Collapse sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Expand Button (when collapsed) */}
        {isCollapsed && (
          <div className="p-2">
            <button
              onClick={toggleSidebar}
              className="w-full flex justify-center text-dashboard-text-secondary hover:text-dashboard-white transition-colors p-3 rounded-lg hover:bg-dashboard-accent"
              aria-label="Expand sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2 py-4' : 'px-6 py-4'} space-y-2`}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <a
                key={index}
                href="#"
                className={`flex items-center rounded-lg transition-colors group ${
                  isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
                } ${
                  item.isActive
                    ? 'bg-dashboard-accent text-dashboard-white'
                    : 'text-dashboard-text-secondary hover:text-dashboard-white hover:bg-dashboard-hover'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="truncate">{item.label}</span>
                )}
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-primary-navy text-dashboard-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}