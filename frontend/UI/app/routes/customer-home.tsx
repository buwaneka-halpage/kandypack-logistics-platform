import React from "react";
import CustomerHome from "../components/customer/CustomerHome";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function CustomerHomePage() {
  return (
    <ProtectedRoute>
      <CustomerHome />
    </ProtectedRoute>
  );
}
