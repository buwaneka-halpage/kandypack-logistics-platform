import React from "react";
import ActivityLogs from "../components/logs/ActivityLogs";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function LogsPage() {
  return (
    <ProtectedRoute>
      <ActivityLogs />
    </ProtectedRoute>
  );
}