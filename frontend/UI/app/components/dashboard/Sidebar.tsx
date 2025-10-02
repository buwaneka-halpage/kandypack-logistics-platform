import { BarChart3, Calendar, Package, Truck, Users, X, ArrowLeft, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "~/contexts/SidebarContext";

export default function Sidebar() {
  const { isCollapsed, toggleSidebar, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const location = useLocation();

  const navItems = [
    { icon: BarChart3, label: "Dashboard", route: "/dashboard", isActive: location.pathname === "/dashboard" },
    { icon: Package, label: "Order Management", route: "/orders", isActive: location.pathname === "/orders" },
    { icon: Calendar, label: "Rail Scheduling", route: "/rail-scheduling", isActive: location.pathname === "/rail-scheduling" },
    { icon: Truck, label: "Last-Mile Delivery", route: "/last-mile", isActive: location.pathname === "/last-mile" },
    { icon: Package, label: "Store Management", route: "/stores", isActive: location.pathname === "/stores" },
    { icon: Users, label: "Admin Management", route: "/admin", isActive: location.pathname === "/admin" },
    { icon: Truck, label: "Router Management", route: "/routers", isActive: location.pathname === "/routers" },
    { icon: BarChart3, label: "Reports", route: "/reports", isActive: location.pathname === "/reports" },
    { icon: Package, label: "Activity Logs", route: "/logs", isActive: location.pathname === "/logs" },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed bg-black bg-opacity-50 z-30"
          style={{
            top: 'var(--header-height)',
            left: 0,
            right: 0,
            bottom: 0
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <aside className={`bg-primary-navy text-dashboard-white transition-all duration-300 ease-in-out sidebar-sticky
        ${/* Desktop styles */ ''}
        lg:block lg:z-10
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        ${/* Mobile styles */ ''}
        fixed left-0 w-64 z-40 lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ 
        top: 'var(--header-height)',
        height: 'calc(100vh - var(--header-height))',
      }}>
      <div className="flex flex-col h-full">
        {/* Header with Logo and Toggle - Desktop Only */}
        <div className="hidden lg:flex items-center justify-between p-0 border-dashboard-border">
          <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-2'}`}>
            
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
          </div>
          {!isCollapsed && (
            <button
              onClick={toggleSidebar}
              className="text-dashboard-text-secondary hover:text-dashboard-white transition-colors p-1 rounded"
              aria-label="Collapse sidebar"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

      

        {/* Navigation */}
        <nav className={`flex-1 space-y-2
          ${/* Desktop styles */ ''}
          ${isCollapsed ? 'lg:px-2 lg:py-4' : 'lg:px-6 lg:py-4'}
          ${/* Mobile styles */ ''}
          px-4 pt-6 pb-4
        `}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.route}
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on item click
                className={`sidebar-nav-item flex items-center rounded-lg transition-all duration-200 group relative
                  ${/* Desktop styles */ ''}
                  ${isCollapsed ? 'lg:justify-center lg:p-3' : 'lg:space-x-3 lg:px-4 lg:py-3'}
                  ${/* Mobile styles */ ''}
                  space-x-3 px-4 py-3
                  ${/* Common styles */ ''}
                  ${
                    item.isActive
                      ? 'bg-dashboard-accent text-dashboard-white shadow-md active'
                      : 'text-dashboard-text-secondary hover:text-dashboard-white hover:bg-dashboard-accent/20 hover:shadow-sm'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                {isCollapsed && (
                  <div className="sidebar-tooltip hidden lg:block absolute left-full ml-2 px-3 py-2 bg-primary-navy text-dashboard-white text-sm rounded-lg group-hover:show whitespace-nowrap z-50 shadow-lg border border-gray-600">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
}