import React from "react";
import AdminManagement from "../components/admin/AdminManagement";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminManagement />
    </ProtectedRoute>
  );
}