import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <SidebarContext.Provider 
      value={{
        isCollapsed,
        toggleSidebar,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

export default SidebarProvider;