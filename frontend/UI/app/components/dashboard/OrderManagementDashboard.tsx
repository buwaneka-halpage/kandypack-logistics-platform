import React, { useState } from "react";
import OrderManagement from "../order-management/OrderManagement";
import { DashboardHeader } from "./DashboardHeader";
import Sidebar from "./Sidebar";

export function OrderManagementDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-dashboard-bg">
      {/* Header */}
      <DashboardHeader onMobileMenuToggle={toggleMobileMenu} />

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full lg:w-auto overflow-x-hidden lg:pt-6 pt-3">
          <OrderManagement />
        </main>
      </div>
    </div>
  );
}

export default OrderManagementDashboard;