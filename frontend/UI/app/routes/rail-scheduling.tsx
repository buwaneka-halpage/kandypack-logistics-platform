import React from "react";
import RailScheduling from "../components/rail-scheduling/RailScheduling";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function RailSchedulingPage() {
  return (
    <ProtectedRoute>
      <RailScheduling />
    </ProtectedRoute>
  );
}