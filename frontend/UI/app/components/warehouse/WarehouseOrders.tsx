import React, { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { OrdersAPI } from '~/services/api';
import { UserRole } from '~/types/roles';
import { 
  Package, 
  Warehouse, 
  MapPin, 
  Calendar,
  AlertCircle,
  Loader2,
  Filter,
  RefreshCw,
  Eye,
  TrendingUp,
} from 'lucide-react';

interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  deliver_address: string;
  deliver_city_id: string;
  status: string;
  full_price: number;
  warehouse_id?: string;
}

const WarehouseOrders: React.FC = () => {
  const { user, hasUserPermissionWithScope } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Check if user has warehouse scope
  const isWarehouseScoped = user?.role === UserRole.STORE_MANAGER || 
                            user?.role === UserRole.WAREHOUSE_STAFF;

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      let fetchedOrders: Order[];

      // If warehouse-scoped user, only fetch their warehouse orders
      if (isWarehouseScoped && user?.warehouseId) {
        fetchedOrders = await OrdersAPI.getByWarehouse(
          user.warehouseId, 
          statusFilter !== 'all' ? { status: statusFilter } : undefined
        );
      } else if (user?.role === UserRole.MANAGEMENT || user?.role === UserRole.SYSTEM_ADMIN) {
        // Management can see all orders
        const params: any = {};
        if (statusFilter !== 'all') {
          params.status = statusFilter;
        }
        fetchedOrders = await OrdersAPI.getAll(params);
      } else {
        fetchedOrders = [];
      }

      setOrders(fetchedOrders);
    } catch (err: any) {
      console.error('Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      'PLACED': 'bg-blue-100 text-blue-800',
      'SCHEDULED_RAIL': 'bg-purple-100 text-purple-800',
      'IN_WAREHOUSE': 'bg-yellow-100 text-yellow-800',
      'SCHEDULED_ROAD': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'FAILED': 'bg-red-100 text-red-800',
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  // Calculate stats
  const stats = {
    total: orders.length,
    totalValue: orders.reduce((sum, o) => sum + o.full_price, 0),
    inProgress: orders.filter(o => 
      !['DELIVERED', 'FAILED'].includes(o.status)
    ).length,
    completed: orders.filter(o => o.status === 'DELIVERED').length,
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <p className="text-sm text-yellow-700">Please log in to view orders.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show warning if warehouse-scoped user doesn't have warehouse assigned
  if (isWarehouseScoped && !user.warehouseId) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">No Warehouse Assigned</h3>
              <p className="text-sm text-yellow-700 mt-1">
                You are not assigned to a warehouse. Please contact your manager or system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-primary-navy animate-spin mx-auto" />
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Package className="w-6 h-6 mr-2 text-primary-navy" />
          {isWarehouseScoped ? 'Warehouse Orders' : 'All Orders'}
        </h1>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          {isWarehouseScoped && user.warehouseName && (
            <>
              <Warehouse className="w-4 h-4 mr-1" />
              <span className="font-medium">{user.warehouseName}</span>
              <span className="mx-2">•</span>
            </>
          )}
          <span>Showing {orders.length} orders</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-primary-navy" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {stats.totalValue.toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
            <Calendar className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <Package className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter className="w-5 h-5 text-gray-400 mr-2" />
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 mr-2">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-primary-navy"
              >
                <option value="all">All Statuses</option>
                <option value="PLACED">Placed</option>
                <option value="SCHEDULED_RAIL">Scheduled (Rail)</option>
                <option value="IN_WAREHOUSE">In Warehouse</option>
                <option value="SCHEDULED_ROAD">Scheduled (Road)</option>
                <option value="DELIVERED">Delivered</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-navy disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">
            {statusFilter !== 'all' 
              ? `No orders with status "${statusFilter}" at the moment.`
              : 'No orders assigned to this warehouse yet.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.order_id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.order_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-start max-w-xs">
                        <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliver_address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs {order.full_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        className="text-primary-navy hover:text-primary-navy/80 font-medium inline-flex items-center"
                        onClick={() => {
                          // TODO: Navigate to order details
                          console.log('View order:', order.order_id);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseOrders;
