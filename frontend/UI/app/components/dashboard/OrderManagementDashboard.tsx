import React from "react";
import OrderManagement from "../order-management/OrderManagement";

// This component is now deprecated since OrderManagement includes the full dashboard layout
// Use OrderManagement directly instead
export function OrderManagementDashboard() {
  return <OrderManagement />;
}

export default OrderManagementDashboard;