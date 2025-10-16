import React from "react";
import RosterManagement from "../components/rosters/RosterManagement";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function RoutersPage() {
  return(
    <ProtectedRoute>
      <RosterManagement />
    </ProtectedRoute>
  );
}