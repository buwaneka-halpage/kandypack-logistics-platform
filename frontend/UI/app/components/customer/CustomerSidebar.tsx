import { Home, Package, MapPin, History, HelpCircle, Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { useSidebar } from "~/contexts/SidebarContext";

export default function CustomerSidebar() {
  const { isCollapsed, isMobileMenuOpen, setIsMobileMenuOpen } = useSidebar();
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

      <aside className={`bg-[#282F4E] text-white transition-all duration-300 ease-in-out sidebar-sticky
        ${/* Desktop styles */ ''}
        lg:block lg:z-10
        ${isCollapsed ? 'lg:w-20' : 'lg:w-56'}
        ${/* Mobile styles */ ''}
        fixed left-0 w-56 z-40 lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{ 
        top: 'var(--header-height)',
        height: 'calc(100vh - var(--header-height))',
      }}>
        <div className="flex flex-col h-full">
          {/* Logo Section - Only visible when not collapsed */}
          {!isCollapsed && (
            <div className="px-6 py-6 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Menu className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-semibold">Home</span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 space-y-1 pt-4
            ${isCollapsed ? 'lg:px-2' : 'lg:px-4'}
            px-3
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
                  className={`flex items-center rounded-lg transition-all duration-200 group relative w-full text-left
                    ${isCollapsed ? 'lg:justify-center lg:p-3' : 'lg:space-x-3 lg:px-4 lg:py-3'}
                    px-4 py-3 space-x-3
                    ${item.isActive 
                      ? 'bg-[#5D5FEF] text-white shadow-lg' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`flex-shrink-0 transition-colors
                    ${isCollapsed ? 'lg:w-6 lg:h-6' : 'lg:w-5 lg:h-5'}
                    w-5 h-5
                  `} />
                  <span className={`font-medium transition-all duration-300 whitespace-nowrap
                    ${isCollapsed ? 'lg:hidden' : 'lg:block'}
                    block
                  `}>
                    {item.label}
                  </span>

                  {/* Tooltip for collapsed state - Desktop only */}
                  {isCollapsed && (
                    <div className="hidden lg:block absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Close Button */}
          <div className="lg:hidden p-4 border-t border-white/10">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
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
