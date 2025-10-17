import React from "react";
import Reports from "../components/reports/Reports";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function ReportsPage() {
  return (
    <ProtectedRoute>
      <Reports />
    </ProtectedRoute>
  );
}