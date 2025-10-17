import React from "react";
import CustomerHome from "../components/customer/CustomerHome";
import { CustomerProtectedRoute } from "../components/CustomerProtectedRoute";

export default function CustomerHomePage() {
  return (
    <CustomerProtectedRoute>
      <CustomerHome />
    </CustomerProtectedRoute>
  );
}
