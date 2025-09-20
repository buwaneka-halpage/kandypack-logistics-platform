export function DashboardSkeleton() {
  return (
    <div className="min-h-screen dashboard-bg">
      {/* Sidebar Skeleton */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 dashboard-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo Skeleton */}
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-white/20 rounded animate-pulse mr-3"></div>
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Navigation Skeleton */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-2 px-6 py-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <li key={index}>
                  <div className="group flex gap-x-3 rounded-md p-2">
                    <div className="h-6 w-6 bg-white/20 rounded animate-pulse"></div>
                    <div className="h-5 w-20 bg-white/20 rounded animate-pulse"></div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User Section Skeleton */}
          <div className="px-6 py-4 border-t border-white/20">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white/20 animate-pulse"></div>
              <div className="ml-3 space-y-1">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse"></div>
                <div className="h-3 w-32 bg-white/20 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="ml-64">
        {/* Header Skeleton */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-80 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content Skeleton */}
        <main className="p-8">
          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="dashboard-card">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="ml-4 flex-1 space-y-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Content Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders Skeleton */}
            <div className="dashboard-card">
              <div className="flex items-center justify-between mb-6">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-1">
                        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Charts Section Skeleton */}
            <div className="space-y-6">
              {/* Performance Chart Skeleton */}
              <div className="dashboard-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
              
              {/* Quick Insights Skeleton */}
              <div className="dashboard-card">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                        <div className="space-y-1">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
