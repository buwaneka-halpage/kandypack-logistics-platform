import React from "react";
import LastMileDelivery from "../components/last-mile/LastMileDelivery";
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function LastMilePage() {
  return (
    <ProtectedRoute>
      <LastMileDelivery />
    </ProtectedRoute>
  );
}