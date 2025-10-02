import React from 'react';
import type { ReactNode } from 'react';
import { DashboardHeader } from './DashboardHeader';
import Sidebar from './Sidebar';
import { SidebarProvider } from "~/contexts/SidebarContext";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-dashboard-bg">
        {/* Header */}
        <DashboardHeader />

        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full lg:w-auto overflow-x-hidden lg:pt-6 pt-3">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;