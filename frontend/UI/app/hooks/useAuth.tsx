import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";
import { AuthAPI, TokenService, ApiError } from "../services/api";
import { UserRole, hasPermission, hasPermissionWithScope, type Permission } from "../types/roles";

// Types
interface User {
  id: string;
  username: string; // Changed from 'email' to 'username'
  name: string;
  role: UserRole;
  warehouseId?: string;  // Assigned warehouse for scoped roles
  warehouseName?: string; // For display purposes
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string, userRole?: 'staff' | 'customer') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasUserPermission: (resource: string, action: string) => boolean;
  hasUserPermissionWithScope: (resource: string, action: string, resourceWarehouseId?: string) => boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token on mount
    const checkAuthStatus = async () => {
      try {
        const token = TokenService.getToken();
        const savedUser = TokenService.getUser();
        
        if (token && savedUser) {
          // Validate token is not expired
          const tokenData = parseJWT(token);
          if (tokenData && tokenData.exp && tokenData.exp * 1000 > Date.now()) {
            setUser(savedUser);
          } else {
            // Token expired, clear everything
            TokenService.clear();
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        TokenService.clear();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Helper to parse JWT (simple decode, not verification)
  const parseJWT = (token: string): any => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const login = async (
    username: string, 
    password: string, 
    userRole: 'staff' | 'customer' = 'customer'
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    try {
      let response;
      
      // Call appropriate login endpoint
      if (userRole === 'staff') {
        response = await AuthAPI.loginStaff(username, password);
        
        // Map backend role string to UserRole enum
        const roleMap: Record<string, UserRole> = {
          'Management': UserRole.MANAGEMENT,
          'StoreManager': UserRole.STORE_MANAGER,
          'WarehouseStaff': UserRole.WAREHOUSE_STAFF,
          'Driver': UserRole.DRIVER,
          'DriverAssistant': UserRole.DRIVER_ASSISTANT,
          'SystemAdmin': UserRole.SYSTEM_ADMIN,
        };
        
        const mappedRole = roleMap[response.role];
        if (!mappedRole) {
          return { success: false, error: 'Invalid role returned from server' };
        }
        
        const user: User = {
          id: response.user_id,
          username: response.user_name, // Store username instead of email
          name: response.user_name,
          role: mappedRole,
          warehouseId: response.warehouse_id, // From backend if user is warehouse-scoped
          warehouseName: response.warehouse_name, // From backend if user is warehouse-scoped
        };
        
        // Store token and user
        TokenService.setToken(response.access_token);
        TokenService.setUser(user);
        setUser(user);
        
        return { success: true };
      } else {
        response = await AuthAPI.loginCustomer(username, password);
        
        const user: User = {
          id: response.customer_id,
          username: response.customer_user_name, // Store username instead of email
          name: response.customer_user_name,
          role: UserRole.CUSTOMER,
        };
        
        // Store token and user
        TokenService.setToken(response.access_token);
        TokenService.setUser(user);
        setUser(user);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof ApiError) {
        return { 
          success: false, 
          error: error.message || 'Invalid credentials' 
        };
      }
      
      return { 
        success: false, 
        error: 'Network error. Please check your connection.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    TokenService.clear();
    
    // Redirect based on user type
    const wasCustomer = user?.role === UserRole.CUSTOMER;
    window.location.href = wasCustomer ? '/login' : '/admin';
  };

  const hasUserPermission = (resource: string, action: string): boolean => {
    if (!user) return false;
    return hasPermission(user.role, resource, action);
  };

  const hasUserPermissionWithScope = (
    resource: string, 
    action: string, 
    resourceWarehouseId?: string
  ): boolean => {
    if (!user) return false;
    return hasPermissionWithScope(
      user.role, 
      resource, 
      action, 
      user.warehouseId, 
      resourceWarehouseId
    );
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
    hasUserPermission,
    hasUserPermissionWithScope
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
