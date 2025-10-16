import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  // Handle unauthorized access - must be at top level for hooks rules
  useEffect(() => {
    if (!loading && isAuthenticated && user?.role !== 'admin') {
      navigate(-1);
      setTimeout(() => {
        alert("Access Denied: You don't have permission to access admin pages. You are logged in as a customer.");
      }, 100);
    }
  }, [loading, isAuthenticated, user?.role, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to admin login
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // If authenticated but not an admin, show redirecting message
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and is an admin, render the protected content
  return <>{children}</>;
}
