import type { Route } from "./+types/dashboard";
import Dashboard from "../components/dashboard/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { Suspense } from "react";
import { DashboardSkeleton } from "../components/dashboard/DashboardSkeleton";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - KandyPack Logistics" },
    { name: "description", content: "Logistics management dashboard for KandyPack" },
  ];
}

export default function DashboardRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard />
      </Suspense>
    </ErrorBoundary>
  );
}