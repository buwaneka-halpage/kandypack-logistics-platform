import { BarChart3, Calendar, Package, Truck, Users, X, ArrowLeft, Menu } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({ isMobileMenuOpen, setIsMobileMenuOpen }: SidebarProps) {
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
              <a
                key={index}
                href="#"
                onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on item click
                className={`flex items-center rounded-lg transition-colors group
                  ${/* Desktop styles */ ''}
                  ${isCollapsed ? 'lg:justify-center lg:p-3' : 'lg:space-x-3 lg:px-4 lg:py-3'}
                  ${/* Mobile styles */ ''}
                  space-x-3 px-4 py-3
                  ${/* Common styles */ ''}
                  ${
                    item.isActive
                      ? 'bg-dashboard-accent text-dashboard-white'
                      : 'text-dashboard-text-secondary hover:text-dashboard-white hover:bg-dashboard-hover'
                  }
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`truncate ${isCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                {isCollapsed && (
                  <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-primary-navy text-dashboard-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
}