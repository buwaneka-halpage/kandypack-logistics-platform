import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  BarChart3, 
  Users, 
  Settings, 
  FileText, 
  MapPin 
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, current: true },
  { name: "Orders", href: "/orders", icon: Package, current: false },
  { name: "Shipments", href: "/shipments", icon: Truck, current: false },
  { name: "Tracking", href: "/tracking", icon: MapPin, current: false },
  { name: "Analytics", href: "/analytics", icon: BarChart3, current: false },
  { name: "Customers", href: "/customers", icon: Users, current: false },
  { name: "Reports", href: "/reports", icon: FileText, current: false },
  { name: "Settings", href: "/settings", icon: Settings, current: false },
];

export function Sidebar() {
  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 dashboard-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center px-6">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-white mr-3" />
            <span className="text-xl font-bold text-white">KandyPack</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-2 px-6 py-4">
            {navigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={`
                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors
                    ${item.current
                      ? 'dashboard-accent text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon
                    className={`h-6 w-6 shrink-0 ${
                      item.current ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* User Section */}
        <div className="px-6 py-4 border-t border-white/20">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-gray-300">admin@kandypack.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}