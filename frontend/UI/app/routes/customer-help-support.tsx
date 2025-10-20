import React from "react";
import { CustomerProtectedRoute } from "../components/CustomerProtectedRoute";
import CustomerHelpAndSupport from "../components/customer/CustomerHelpAndSupport";

export default function CustomerHelpSupportPage() {
  return (
    <CustomerProtectedRoute>
      <CustomerHelpAndSupport />
    </CustomerProtectedRoute>
  );
}
