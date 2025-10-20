import React from "react";
import { CustomerProtectedRoute } from "../components/CustomerProtectedRoute";
import CustomeOrderHistory from "../components/customer/CustomerOrderHistory";

export default function CustomerOrderHistoryPage() {
  return (
    <CustomerProtectedRoute>
      <CustomeOrderHistory />
    </CustomerProtectedRoute>
  );
}
