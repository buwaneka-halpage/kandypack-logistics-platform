import React, { useState, useEffect } from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { OrdersAPI } from '~/services/api';
import { useAuth } from '~/hooks/useAuth';
import { hasPermission, UserRole } from '~/types/roles';

interface DeliveryStat {
  label: string;
  value: number;
  color: string;
  count: number;
}

const DeliveryProgress: React.FC = () => {
  const { user } = useAuth();
  const [deliveryStats, setDeliveryStats] = useState<DeliveryStat[]>([
    { label: 'Delivered', value: 0, color: 'dashboard-accent', count: 0 },
    { label: 'In Transit', value: 0, color: 'blue-500', count: 0 },
    { label: 'Pending', value: 0, color: 'gray-300', count: 0 }
  ]);
  const [totalDeliveries, setTotalDeliveries] = useState<number>(0);
  const [completionPercentage, setCompletionPercentage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
  const canViewOrders = user && (
    hasPermission(user.role as UserRole, 'order', 'read') ||
    hasPermission(user.role as UserRole, '*', 'read')
  );

  const canDownloadStats = user && (
    hasPermission(user.role as UserRole, 'reports', 'execute') ||
    hasPermission(user.role as UserRole, '*', 'execute')
  );

  useEffect(() => {
    if (!canViewOrders) {
      setError('You do not have permission to view order data');
      setIsLoading(false);
      return;
    }

    fetchDeliveryStats();
  }, [user]);

  const fetchDeliveryStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build filters based on user role
      const filters: any = {};

      // Add warehouse filter for warehouse-scoped roles
      if (user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT) {
        filters.warehouse_id = user.warehouseId;
      }

      // Fetch all orders
      const orders = await OrdersAPI.getAll(filters);

      if (!orders || orders.length === 0) {
        setTotalDeliveries(0);
        setCompletionPercentage(0);
        setDeliveryStats([
          { label: 'Delivered', value: 0, color: 'dashboard-accent', count: 0 },
          { label: 'In Transit', value: 0, color: 'blue-500', count: 0 },
          { label: 'Pending', value: 0, color: 'gray-300', count: 0 }
        ]);
        setIsLoading(false);
        return;
      }

      // Count orders by status
      const statusCounts = {
        delivered: 0,
        inTransit: 0,
        pending: 0
      };

      orders.forEach((order: any) => {
        const status = order.status?.toUpperCase() || 'PENDING';
        
        if (status === 'DELIVERED' || status === 'COMPLETED') {
          statusCounts.delivered++;
        } else if (status === 'IN_TRANSIT' || status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY') {
          statusCounts.inTransit++;
        } else {
          statusCounts.pending++;
        }
      });

      const total = orders.length;
      const completion = Math.round((statusCounts.delivered / total) * 100);

      setTotalDeliveries(total);
      setCompletionPercentage(completion);
      setDeliveryStats([
        { 
          label: 'Delivered', 
          value: Math.round((statusCounts.delivered / total) * 100), 
          color: 'dashboard-accent',
          count: statusCounts.delivered
        },
        { 
          label: 'In Transit', 
          value: Math.round((statusCounts.inTransit / total) * 100), 
          color: 'blue-500',
          count: statusCounts.inTransit
        },
        { 
          label: 'Pending', 
          value: Math.round((statusCounts.pending / total) * 100), 
          color: 'gray-300',
          count: statusCounts.pending
        }
      ]);
      
    } catch (error: any) {
      console.error('Error fetching delivery stats:', error);
      setError(error.message || 'Failed to load delivery statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!canDownloadStats) {
      alert('You do not have permission to download statistics');
      return;
    }

    try {
      // Create CSV content
      const csvContent = [
        ['Status', 'Count', 'Percentage'],
        ...deliveryStats.map(stat => [
          stat.label,
          stat.count.toString(),
          `${stat.value}%`
        ]),
        ['Total', totalDeliveries.toString(), '100%']
      ].map(row => row.join(',')).join('\n');

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `delivery-stats-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading stats:', error);
      alert('Failed to download statistics');
    }
  };

  return (
    <div className="bg-dashboard-white rounded-lg shadow-sm border border-dashboard-border p-3 sm:p-4 lg:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-dashboard-text-primary">Delivery Progress</h3>
          {user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT && (
            <p className="text-xs text-dashboard-text-secondary mt-1">Warehouse-scoped data</p>
          )}
        </div>
        {!canViewOrders && (
          <div className="flex items-center space-x-1 px-2 py-1 bg-status-cancelled text-dashboard-white rounded text-xs">
            <AlertCircle className="w-3 h-3" />
            <span>No Access</span>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dashboard-accent"></div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-status-cancelled mx-auto mb-2" />
            <p className="text-sm text-dashboard-text-secondary">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* Circular Progress */}
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${(completionPercentage / 100) * 251.2} 251.2`}
                  className="transition-all duration-500"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff6b6b" />
                    <stop offset="100%" stopColor="#ff8e8e" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{completionPercentage}%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Legend */}
          <div className="space-y-2 sm:space-y-3">
            {deliveryStats.map((stat: DeliveryStat, index: number) => (
              <div key={stat.label} className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${stat.color}`}></div>
                  <span className="text-xs sm:text-sm text-gray-600">{stat.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{stat.value}%</span>
                  <span className="text-xs text-gray-500 ml-2">({stat.count})</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-dashboard-border">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-dashboard-text-primary">Total Orders</span>
              <span className="font-bold text-dashboard-accent">{totalDeliveries}</span>
            </div>
          </div>
          
          {/* Download Button */}
          {canDownloadStats && (
            <button 
              onClick={handleDownload}
              className="w-full mt-4 sm:mt-6 flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 transition-colors"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Download Statistics</span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default DeliveryProgress;
