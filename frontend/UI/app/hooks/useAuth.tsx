import { useState, useEffect, createContext, useContext } from "react";
import type { ReactNode } from "react";

// Types
interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, userRole?: 'admin' | 'customer') => Promise<boolean>;
  logout: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing auth token/session
    const checkAuthStatus = async () => {
      try {
        // In a real app, you'd check localStorage/sessionStorage or make an API call
        const savedUser = localStorage.getItem('kandypack_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string, userRole: 'admin' | 'customer' = 'customer'): Promise<boolean> => {
    setLoading(true);
    try {
      // Simulate API call - replace with real authentication
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login for demo purposes
      // Admin login
      if (email === "admin@kandypack.com" && password === "password" && userRole === "admin") {
        const mockUser: User = {
          id: "1",
          email: "admin@kandypack.com",
          name: "Admin User",
          role: "admin"
        };
        
        setUser(mockUser);
        localStorage.setItem('kandypack_user', JSON.stringify(mockUser));
        return true;
      }
      
      // Customer login
      if (email === "customer@kandypack.com" && password === "password" && userRole === "customer") {
        const mockUser: User = {
          id: "2",
          email: "customer@kandypack.com",
          name: "Customer User",
          role: "customer"
        };
        
        setUser(mockUser);
        localStorage.setItem('kandypack_user', JSON.stringify(mockUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kandypack_user');
    // Use window.location for redirect to ensure clean state reset
    window.location.href = '/admin';
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
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
