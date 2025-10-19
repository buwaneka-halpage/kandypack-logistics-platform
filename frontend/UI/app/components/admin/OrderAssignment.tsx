import React, { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { OrdersAPI, StoresAPI } from '~/services/api';
import { UserRole } from '~/types/roles';
import { 
  Package, 
  Warehouse, 
  MapPin, 
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
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

interface Store {
  store_id: string;
  name: string;
  address: string;
  city_id: string;
  station_id: string;
}

const OrderAssignment: React.FC = () => {
  const { user, hasUserPermission } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Record<string, string>>({});

  // Check if user has permission to assign warehouses
  const canAssignWarehouses = hasUserPermission('warehouse', 'assign') || 
                              hasUserPermission('order-assignment', 'create');

  useEffect(() => {
    if (!canAssignWarehouses) {
      setError('You do not have permission to assign warehouses.');
      setLoading(false);
      return;
    }

    loadData();
  }, [canAssignWarehouses]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch unassigned orders (those without warehouse_id)
      const allOrders = await OrdersAPI.getAll();
      const unassignedOrders = allOrders.filter((order: Order) => !order.warehouse_id);
      setOrders(unassignedOrders);

      // Fetch all warehouses
      const allWarehouses = await StoresAPI.getAll();
      setWarehouses(allWarehouses);

    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load orders and warehouses');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignWarehouse = async (orderId: string) => {
    const warehouseId = selectedWarehouse[orderId];
    
    if (!warehouseId) {
      setError('Please select a warehouse for this order');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setAssigning(orderId);
      setError(null);
      setSuccess(null);

      await OrdersAPI.assignToWarehouse(orderId, warehouseId);
      
      setSuccess(`Order ${orderId.substring(0, 8)}... successfully assigned to warehouse`);
      
      // Remove assigned order from list
      setOrders(orders.filter(o => o.order_id !== orderId));
      
      // Clear selection
      const newSelections = { ...selectedWarehouse };
      delete newSelections[orderId];
      setSelectedWarehouse(newSelections);

      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Error assigning warehouse:', err);
      setError(err.message || 'Failed to assign warehouse');
      setTimeout(() => setError(null), 5000);
    } finally {
      setAssigning(null);
    }
  };

  const getWarehouseName = (warehouseId: string): string => {
    const warehouse = warehouses.find(w => w.store_id === warehouseId);
    return warehouse ? warehouse.name : warehouseId;
  };

  if (!canAssignWarehouses) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <XCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
              <p className="text-sm text-red-700 mt-1">
                You do not have permission to assign orders to warehouses.
                Only Management and System Administrators can perform this action.
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
          <p className="text-gray-600 mt-4">Loading orders and warehouses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Warehouse className="w-6 h-6 mr-2 text-primary-navy" />
          Order Warehouse Assignment
        </h1>
        <p className="text-gray-600 mt-1">
          Assign unassigned customer orders to warehouses for processing
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unassigned Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Available Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
            <Warehouse className="w-8 h-8 text-primary-navy" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {orders.reduce((sum, o) => sum + o.full_price, 0).toLocaleString()}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-600">
            There are no unassigned orders at the moment. All orders have been assigned to warehouses.
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
                    Assign Warehouse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
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
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-1 mt-0.5 text-gray-400 flex-shrink-0" />
                        <span className="line-clamp-2">{order.deliver_address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rs {order.full_price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative">
                        <select
                          value={selectedWarehouse[order.order_id] || ''}
                          onChange={(e) => setSelectedWarehouse({
                            ...selectedWarehouse,
                            [order.order_id]: e.target.value
                          })}
                          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-navy focus:border-primary-navy"
                          disabled={assigning === order.order_id}
                        >
                          <option value="">Select Warehouse</option>
                          {warehouses.map((warehouse) => (
                            <option key={warehouse.store_id} value={warehouse.store_id}>
                              {warehouse.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleAssignWarehouse(order.order_id)}
                        disabled={!selectedWarehouse[order.order_id] || assigning === order.order_id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-navy hover:bg-primary-navy/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-navy disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {assigning === order.order_id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Assigning...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Assign
                          </>
                        )}
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

export default OrderAssignment;
