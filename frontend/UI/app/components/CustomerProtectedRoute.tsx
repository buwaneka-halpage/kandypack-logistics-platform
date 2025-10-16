import { Navigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { ReactNode } from "react";

interface CustomerProtectedRouteProps {
  children: ReactNode;
}

export function CustomerProtectedRoute({ children }: CustomerProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5FEF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to customer login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
