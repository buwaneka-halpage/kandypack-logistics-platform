import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface CustomerProtectedRouteProps {
  children: ReactNode;
}

export function CustomerProtectedRoute({ children }: CustomerProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  // Handle unauthorized access - must be at top level for hooks rules
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'customer') {
      navigate(-1);
      setTimeout(() => {
        alert("Access Denied: You don't have permission to access customer pages. You are logged in as an admin.");
      }, 100);
    }
  }, [loading, isAuthenticated, user?.role, navigate]);

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

  // If authenticated but not a customer, show redirecting message
  if (user?.role !== 'customer') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5D5FEF] mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and is a customer, render the protected content
  return <>{children}</>;
}
