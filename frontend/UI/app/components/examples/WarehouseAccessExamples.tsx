/**
 * Warehouse-Scoped Access Control Examples
 * 
 * This file demonstrates how to implement warehouse-based access control
 * in components across different user roles.
 */

import { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { UserRole } from '~/types/roles';
import { OrdersAPI, StoresAPI } from '~/services/api';

/**
 * Example 1: Management - Order Assignment to Warehouses
 * 
 * Management and SystemAdmin can:
 * - View all unassigned orders
 * - View all warehouses
 * - Assign orders to specific warehouses
 */
export function OrderAssignmentPage() {
  const { user, hasUserPermission } = useAuth();
  const [unassignedOrders, setUnassignedOrders] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Only Management and SystemAdmin can access this
      if (!hasUserPermission('warehouse', 'assign')) {
        return;
      }

      // Load unassigned orders (no warehouse_id)
      const orders = await OrdersAPI.getAll({ status: 'pending' });
      const unassigned = orders.filter((order: any) => !order.warehouse_id);
      setUnassignedOrders(unassigned);

      // Load all warehouses
      const warehousesData = await StoresAPI.getAll();
      setWarehouses(warehousesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignOrder = async (orderId: string, warehouseId: string) => {
    try {
      await OrdersAPI.assignToWarehouse(orderId, warehouseId);
      alert('Order assigned successfully!');
      loadData(); // Refresh
    } catch (error) {
      console.error('Failed to assign order:', error);
      alert('Failed to assign order');
    }
  };

  // Access control check
  if (!hasUserPermission('warehouse', 'assign')) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">Only Management and System Administrators can assign orders to warehouses.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Assign Orders to Warehouses</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Unassigned Orders */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Unassigned Orders ({unassignedOrders.length})</h2>
          <div className="space-y-3">
            {unassignedOrders.map(order => (
              <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                    <p className="text-sm text-gray-600">Destination: {order.destination_city}</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                    Unassigned
                  </span>
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium mb-1">Assign to Warehouse:</label>
                  <select 
                    className="w-full border rounded px-3 py-2"
                    onChange={(e) => handleAssignOrder(order.id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>Select warehouse...</option>
                    {warehouses.map(warehouse => (
                      <option key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} - {warehouse.city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouses Overview */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Warehouses ({warehouses.length})</h2>
          <div className="space-y-3">
            {warehouses.map(warehouse => (
              <div key={warehouse.id} className="border rounded-lg p-4 bg-white shadow">
                <h3 className="font-medium">{warehouse.name}</h3>
                <p className="text-sm text-gray-600">Location: {warehouse.city}</p>
                <p className="text-sm text-gray-600">Capacity: {warehouse.capacity_used || 0}/{warehouse.capacity}</p>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((warehouse.capacity_used || 0) / warehouse.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Example 2: Store Manager - Warehouse-Scoped Orders View
 * 
 * Store Manager can:
 * - View only orders assigned to their warehouse
 * - Cannot see orders from other warehouses
 * - Cannot assign orders to warehouses
 */
export function WarehouseOrdersPage() {
  const { user, hasUserPermissionWithScope } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [user]);

  const loadOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Management/SystemAdmin see all orders
      if (user.role === UserRole.MANAGEMENT || user.role === UserRole.SYSTEM_ADMIN) {
        const allOrders = await OrdersAPI.getAll();
        setOrders(allOrders);
      } 
      // Warehouse-scoped roles see only their warehouse orders
      else if (user.warehouseId) {
        const warehouseOrders = await OrdersAPI.getByWarehouse(user.warehouseId);
        setOrders(warehouseOrders);
      } else {
        // User has no warehouse assigned
        console.error('User has no warehouse assigned');
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async (orderId: string, orderWarehouseId: string) => {
    // Check if user has permission to update this specific order
    const canUpdate = hasUserPermissionWithScope('order', 'update', orderWarehouseId);
    
    if (!canUpdate) {
      alert('You do not have permission to update orders from other warehouses');
      return;
    }

    // Proceed with update
    try {
      // Your update logic here
      console.log('Updating order:', orderId);
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (!user) return null;

  if (loading) {
    return <div className="p-8">Loading orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        {user.warehouseName && (
          <p className="text-gray-600">Warehouse: {user.warehouseName}</p>
        )}
        {(user.role === UserRole.MANAGEMENT || user.role === UserRole.SYSTEM_ADMIN) && (
          <p className="text-blue-600 font-medium">Viewing all warehouses</p>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No orders found for your warehouse
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Customer: {order.customer_name}</p>
                  <p className="text-sm text-gray-600">Warehouse: {order.warehouse_name}</p>
                  <p className="text-sm text-gray-600">Status: {order.status}</p>
                </div>
                
                {hasUserPermissionWithScope('order', 'update', order.warehouse_id) && (
                  <button
                    onClick={() => handleUpdateOrder(order.id, order.warehouse_id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Update Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: Warehouse Staff - Inventory Management
 * 
 * Warehouse Staff can:
 * - View and manage inventory for their assigned warehouse only
 * - Cannot access inventory from other warehouses
 */
export function WarehouseInventoryPage() {
  const { user, hasUserPermission } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInventory();
  }, [user]);

  const loadInventory = async () => {
    if (!user?.warehouseId) {
      console.error('User has no warehouse assigned');
      return;
    }

    try {
      setLoading(true);
      // API call would filter by warehouse_id
      // const data = await InventoryAPI.getByWarehouse(user.warehouseId);
      // setInventory(data);
      
      // Placeholder
      setInventory([]);
    } catch (error) {
      console.error('Failed to load inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.warehouseId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">No Warehouse Assigned</h2>
        <p className="mt-2">Please contact your administrator to assign you to a warehouse.</p>
      </div>
    );
  }

  if (!hasUserPermission('inventory', 'read')) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
        <p className="mt-2">You do not have permission to view inventory.</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <p className="text-gray-600">Warehouse: {user.warehouseName}</p>
        <p className="text-sm text-gray-500">You can only manage inventory for your assigned warehouse</p>
      </div>

      {/* Inventory list would go here */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800">
          🔒 <strong>Warehouse-Scoped Access:</strong> You can only view and manage inventory 
          items for warehouse: <strong>{user.warehouseName}</strong>
        </p>
      </div>
    </div>
  );
}

/**
 * Example 4: Role-Based Dashboard Component
 * 
 * Shows different content based on user's role and warehouse assignment
 */
export function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Management Dashboard - All Warehouses */}
      {(user.role === UserRole.MANAGEMENT || user.role === UserRole.SYSTEM_ADMIN) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Management View</h2>
          <p className="text-gray-700 mb-4">You have access to all warehouses across the country</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">245</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Active Warehouses</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">48</p>
              <p className="text-sm text-gray-600">Unassigned Orders</p>
            </div>
          </div>
        </div>
      )}

      {/* Store Manager Dashboard - Single Warehouse */}
      {user.role === UserRole.STORE_MANAGER && user.warehouseId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Store Manager - {user.warehouseName}</h2>
          <p className="text-gray-700 mb-4">Managing operations for your assigned warehouse</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">34</p>
              <p className="text-sm text-gray-600">Pending Orders</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">8</p>
              <p className="text-sm text-gray-600">Staff Members</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-gray-600">Inventory Items</p>
            </div>
          </div>
        </div>
      )}

      {/* Warehouse Staff Dashboard - Single Warehouse */}
      {user.role === UserRole.WAREHOUSE_STAFF && user.warehouseId && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Warehouse Operations - {user.warehouseName}</h2>
          <p className="text-gray-700 mb-4">Inventory and shipment management</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-600">Today's Shipments</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">89%</p>
              <p className="text-sm text-gray-600">Capacity Used</p>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-2xl font-bold">5</p>
              <p className="text-sm text-gray-600">Low Stock Items</p>
            </div>
          </div>
        </div>
      )}

      {/* Warning if no warehouse assigned */}
      {[UserRole.STORE_MANAGER, UserRole.WAREHOUSE_STAFF, UserRole.DRIVER_ASSISTANT].includes(user.role) && 
       !user.warehouseId && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 mb-2">⚠️ No Warehouse Assigned</h2>
          <p className="text-red-700">
            Your account is not assigned to a warehouse. Please contact your administrator 
            to assign you to a warehouse location.
          </p>
        </div>
      )}
    </div>
  );
}

export default {
  OrderAssignmentPage,
  WarehouseOrdersPage,
  WarehouseInventoryPage,
  RoleBasedDashboard,
};
