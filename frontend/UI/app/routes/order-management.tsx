import React from "react";
import OrderManagement from "../components/order-management/OrderManagement";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function OrderManagementPage() {
  return (
    <ProtectedRoute>
      <OrderManagement />
    </ProtectedRoute>
  );
}