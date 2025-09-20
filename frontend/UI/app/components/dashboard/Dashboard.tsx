import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "./DashboardHeader";
import { StatsCards } from "./StatsCards";
import { RecentOrders } from "./RecentOrders";
import { ChartSection } from "./ChartSection";

export function Dashboard() {
  return (
    <div className="min-h-screen dashboard-bg">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <DashboardHeader />
        
        {/* Dashboard Content */}
        <main className="p-8">
          {/* Stats Overview */}
          <StatsCards />
          
          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Recent Orders */}
            <RecentOrders />
            
            {/* Charts/Analytics */}
            <ChartSection />
          </div>
        </main>
      </div>
    </div>
  );
}