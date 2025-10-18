import { Home, Package, MapPin, History, HelpCircle, Menu, X, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSidebar } from "~/contexts/SidebarContext";

export default function CustomerSidebar() {
  const { isCollapsed, toggleSidebar, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Home", route: "/customer/home", isActive: location.pathname === "/customer/home" },
    { icon: Package, label: "New Order", route: "/customer/new-order", isActive: location.pathname === "/customer/new-order" },
    { icon: MapPin, label: "Track My Orders", route: "/customer/track-order", isActive: location.pathname === "/customer/track-order" },
    { icon: History, label: "Order History", route: "/customer/order-history", isActive: location.pathname === "/customer/order-history" },
    { icon: HelpCircle, label: "Help And Support", route: "/customer/help-support", isActive: location.pathname === "/customer/help-support" },
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
          <div className="hidden lg:flex items-center justify-between p-4 border-b border-dashboard-border">
            {/* Expand Button (when collapsed) */}
            {isCollapsed ? (
              <button
                onClick={toggleSidebar}
                className="w-full flex justify-center text-dashboard-text-secondary hover:text-dashboard-white transition-colors p-2 rounded-lg hover:bg-dashboard-accent/20"
                aria-label="Expand sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-lg font-semibold text-dashboard-white">Menu</span>
                <button
                  onClick={toggleSidebar}
                  className="text-dashboard-text-secondary hover:text-dashboard-white transition-colors p-1 rounded"
                  aria-label="Collapse sidebar"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </div>
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
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    navigate(item.route);
                  }}
                  className={`sidebar-nav-item flex items-center rounded-lg transition-all duration-200 group relative w-full text-left
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
                </button>
              );
            })}
          </nav>

          {/* Mobile Close Button */}
          <div className="lg:hidden p-4 border-t border-dashboard-border">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-dashboard-accent/20 hover:bg-dashboard-accent/30 rounded-lg transition-colors text-dashboard-white"
            >
              <X className="w-5 h-5" />
              <span>Close Menu</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
