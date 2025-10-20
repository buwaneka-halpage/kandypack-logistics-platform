import { Outlet } from "react-router";
import CustomerSidebar from "./CustomerSidebar";
import { CustomerHeader } from "./CustomerHeader";
import { useSidebar } from "~/contexts/SidebarContext";

export default function CustomerLayout() {
  const { isCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CustomerHeader />

      {/* Main Layout */}
      <div
        className="flex"
        style={{
          marginTop: "var(--header-height)",
          minHeight: "calc(100vh - var(--header-height))",
        }}
      >
        {/* Sidebar */}
        <CustomerSidebar />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out
          ${/* Desktop styles */ ""}
          ${isCollapsed ? "lg:ml-20" : "lg:ml-0"}
          ${/* Mobile styles - no margin since sidebar is overlay */ ""}
          ml-0
        `}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
