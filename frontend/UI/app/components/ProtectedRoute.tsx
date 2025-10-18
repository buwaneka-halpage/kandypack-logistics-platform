import { Navigate, useNavigate } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { UserRole } from "~/types/roles";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: { resource: string; action: string };
}

export function ProtectedRoute({ children, requiredPermission }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user, hasUserPermission } = useAuth();
  const navigate = useNavigate();

  // Check if user has required permission
  const hasAccess = () => {
    if (!user) return false;
    
    // Customer role should not have access to protected routes
    if (user.role === UserRole.CUSTOMER) return false;
    
    // If specific permission is required, check for it
    if (requiredPermission) {
      return hasUserPermission(requiredPermission.resource, requiredPermission.action);
    }
    
    // Otherwise, any staff role has access
    return true;
  };

  // Handle unauthorized access
  useEffect(() => {
    if (!loading && isAuthenticated && !hasAccess()) {
      navigate(-1);
      setTimeout(() => {
        alert("Access Denied: You don't have permission to access this page.");
      }, 100);
    }
  }, [loading, isAuthenticated, user, navigate]);

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

  // If authenticated but doesn't have access, show redirecting message
  if (!hasAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-navy mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has access, render the protected content
  return <>{children}</>;
}
