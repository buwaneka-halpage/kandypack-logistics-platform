import React from "react";
import { CustomerProtectedRoute } from "../components/CustomerProtectedRoute";
import CustomerNewOrder from "../components/customer/CustomerNewOrder";

export default function CustomerNewOrderPage() {
  return (
    <CustomerProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#282F4E]">
          New Order
        </h1>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <CustomerNewOrder />
        </div>
      </div>
    </CustomerProtectedRoute>
  );
}
