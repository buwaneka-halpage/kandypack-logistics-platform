import type { Route } from "./+types/dashboard";
import Dashboard from "../components/dashboard/Dashboard";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Suspense } from "react";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - KandyPack Logistics" },
    { name: "description", content: "Logistics management dashboard for KandyPack" },
  ];
}

export default function DashboardRoute() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    </ProtectedRoute>
  );
}