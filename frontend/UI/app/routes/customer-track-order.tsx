import React from "react";
import { CustomerProtectedRoute } from "../components/CustomerProtectedRoute";
import CustomerTrackMyOrders from "../components/customer/CustomerTrackMyOrders";

export default function CustomerTrackOrderPage() {
  return (
    <CustomerProtectedRoute>
      <CustomerTrackMyOrders />
    </CustomerProtectedRoute>
  );
}
