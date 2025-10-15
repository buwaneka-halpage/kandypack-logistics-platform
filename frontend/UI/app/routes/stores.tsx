import React from "react";
import StoreManagement from "../components/stores/StoreManagement";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function StoresPage() {
  return (
    <ProtectedRoute>
      <StoreManagement />
    </ProtectedRoute>
  );
}