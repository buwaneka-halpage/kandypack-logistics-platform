import * as React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, ChevronDown, Loader2, X } from "lucide-react";
import { OrdersAPI, CustomersAPI, StoresAPI, CitiesAPI } from "~/services/api";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

// Import dashboard layout
import DashboardLayout from "../dashboard/DashboardLayout";

// Types
interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  deliver_address: string;
  status: string;
  deliver_city_id: string;
  full_price: number;
  warehouse_id?: string | null;
}

interface Customer {
  customer_id: string;
  customer_name: string;
}

interface Store {
  store_id: string;
  name: string;
  address: string;
  telephone_number: string;
  contact_person: string;
  station_id: string;
  city_name?: string | null; // City name from backend
}

interface City {
  city_id: string;
  city_name: string;
  province: string;
}

type OrderStatus = "DISPATCHED" | "DELIVERED" | "PENDING" | "PLACED" | "SCHEDULED_RAIL" | "IN_WAREHOUSE" | "SCHEDULED_ROAD" | "FAILED";

// Status mapping - Frontend keys to Backend enum values
const STATUS_TO_ENUM: Record<string, string> = {
  "PLACED": "Placed",
  "SCHEDULED_RAIL": "Scheduled for Railway",
  "IN_WAREHOUSE": "IN Warehouse",
  "SCHEDULED_ROAD": "Scheduled for road",
  "DELIVERED": "Delivered",
  "FAILED": "Failed"
};

// Reverse mapping - Backend enum values to Frontend keys
const ENUM_TO_STATUS: Record<string, string> = {
  "Placed": "PLACED",
  "Scheduled for Railway": "SCHEDULED_RAIL",
  "IN Warehouse": "IN_WAREHOUSE",
  "Scheduled for road": "SCHEDULED_ROAD",
  "Delivered": "DELIVERED",
  "Failed": "FAILED"
};

const getStatusVariant = (status: string) => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case "DELIVERED":
      return "default"; // Green
    case "PENDING":
    case "PLACED":
      return "secondary"; // Yellow/Orange
    case "DISPATCHED":
    case "SCHEDULED_RAIL":
    case "SCHEDULED_ROAD":
    case "IN_WAREHOUSE":
      return "outline"; // Blue
    case "FAILED":
      return "destructive"; // Red
    default:
      return "outline"; // Gray
  }
};

const getStatusColor = (status: string) => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case "DELIVERED":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING":
    case "PLACED":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "DISPATCHED":
    case "SCHEDULED_RAIL":
    case "SCHEDULED_ROAD":
    case "IN_WAREHOUSE":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "FAILED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Map<string, string>>(new Map());
  const [stores, setStores] = useState<Store[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("last-30-days");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // CRUD state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isAssignWarehouseDialogOpen, setIsAssignWarehouseDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    deliver_address: '',
    deliver_city_id: '',
    full_price: 0,
    order_date: '',
  });
  
  // Status update state
  const [newStatus, setNewStatus] = useState<string>('');
  
  // Warehouse assignment state
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string>('');

  // Fetch orders, customers, stores, and cities
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [ordersData, customersData, storesData, citiesData] = await Promise.all([
          OrdersAPI.getAll(),
          CustomersAPI.getAll(),
          StoresAPI.getAll(),  // Now returns city_name for each store
          CitiesAPI.getAll()
        ]);
        
        console.log('Orders fetched:', ordersData.length);
        console.log('Sample order statuses:', ordersData.slice(0, 5).map((o: any) => o.status));
        console.log('Sample stores with cities:', storesData.slice(0, 3));
        
        setOrders(ordersData);
        setStores(storesData);
        setCities(citiesData);
        
        // Create a map of customer_id to customer_name
        const customerMap = new Map<string, string>();
        customersData.forEach((customer: Customer) => {
          customerMap.set(customer.customer_id, customer.customer_name);
        });
        setCustomers(customerMap);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, dateFilter, cityFilter]);

  // CRUD Handlers
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditForm({
      deliver_address: order.deliver_address,
      deliver_city_id: order.deliver_city_id || '',
      full_price: order.full_price,
      order_date: order.order_date.split('T')[0], // Convert to date only
    });
    setIsEditDialogOpen(true);
    setActionError(null);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
    setActionError(null);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
    setActionError(null);
  };
  
  const handleAssignWarehouse = (order: Order) => {
    setSelectedOrder(order);
    setSelectedWarehouseId(order.warehouse_id || '');
    setIsAssignWarehouseDialogOpen(true);
    setActionError(null);
  };

  const confirmEditOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      
      // Backend expects full order update schema
      const statusEnumValue = STATUS_TO_ENUM[selectedOrder.status] || selectedOrder.status;
      
      const updatePayload = {
        order_id: selectedOrder.order_id, // Required by schema inheritance
        customer_id: selectedOrder.customer_id, // Required by schema inheritance
        order_date: editForm.order_date, // Use edited date
        deliver_address: editForm.deliver_address,
        status: statusEnumValue, // Send as enum VALUE
        deliver_city_id: editForm.deliver_city_id,
        full_price: editForm.full_price,
        warehouse_id: selectedOrder.warehouse_id || null // Keep existing warehouse
      };
      
      console.log('Update order payload:', updatePayload);
      
      await OrdersAPI.update(selectedOrder.order_id, updatePayload);
      
      // Refresh data
      const ordersData = await OrdersAPI.getAll();
      setOrders(ordersData);
      
      setIsEditDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Error updating order:', err);
      console.error('Error details:', { message: err.message, data: err.data, status: err.status });
      
      // Handle Pydantic validation errors (array of error objects)
      let errorMessage = 'Failed to update order';
      if (err.data?.detail && Array.isArray(err.data.detail)) {
        errorMessage = err.data.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
      } else if (typeof err.data?.detail === 'string') {
        errorMessage = err.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setActionError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      
      // Backend expects full order update schema with status as enum VALUE (not key)
      const statusEnumValue = STATUS_TO_ENUM[newStatus] || newStatus;
      
      const updatePayload = {
        order_id: selectedOrder.order_id, // Required by schema inheritance
        customer_id: selectedOrder.customer_id, // Required by schema inheritance
        order_date: selectedOrder.order_date.split('T')[0], // Convert to date only
        deliver_address: selectedOrder.deliver_address,
        status: statusEnumValue, // Send as enum VALUE ("Placed", "Scheduled for Railway", etc.)
        deliver_city_id: selectedOrder.deliver_city_id || '',
        full_price: selectedOrder.full_price,
        warehouse_id: selectedOrder.warehouse_id || null // Optional field
      };
      
      console.log('Update status payload:', updatePayload);
      console.log('Status mapping:', { newStatus, statusEnumValue });
      
      await OrdersAPI.update(selectedOrder.order_id, updatePayload);
      
      // Update local state
      setOrders(orders.map(o => 
        o.order_id === selectedOrder.order_id 
          ? { ...o, status: newStatus }
          : o
      ));
      
      setIsStatusDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Error updating status:', err);
      console.error('Error details:', { message: err.message, data: err.data, status: err.status });
      
      // Handle Pydantic validation errors (array of error objects)
      let errorMessage = 'Failed to update status';
      if (err.data?.detail && Array.isArray(err.data.detail)) {
        errorMessage = err.data.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
      } else if (typeof err.data?.detail === 'string') {
        errorMessage = err.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setActionError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      
      await OrdersAPI.delete(selectedOrder.order_id);
      
      // Remove from local state
      setOrders(orders.filter(o => o.order_id !== selectedOrder.order_id));
      
      setIsDeleteDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Error deleting order:', err);
      setActionError(err.message || 'Failed to delete order');
    } finally {
      setActionLoading(false);
    }
  };
  
  const confirmAssignWarehouse = async () => {
    if (!selectedOrder) return;
    
    try {
      setActionLoading(true);
      setActionError(null);
      
      // Backend expects full order update schema
      const statusEnumValue = STATUS_TO_ENUM[selectedOrder.status] || selectedOrder.status;
      
      const updatePayload = {
        order_id: selectedOrder.order_id,
        customer_id: selectedOrder.customer_id,
        order_date: selectedOrder.order_date.split('T')[0],
        deliver_address: selectedOrder.deliver_address,
        status: statusEnumValue,
        deliver_city_id: selectedOrder.deliver_city_id || '',
        full_price: selectedOrder.full_price,
        warehouse_id: selectedWarehouseId || null // Update warehouse
      };
      
      console.log('Assign warehouse payload:', updatePayload);
      
      await OrdersAPI.update(selectedOrder.order_id, updatePayload);
      
      // Refresh data
      const ordersData = await OrdersAPI.getAll();
      setOrders(ordersData);
      
      setIsAssignWarehouseDialogOpen(false);
      setSelectedOrder(null);
    } catch (err: any) {
      console.error('Error assigning warehouse:', err);
      
      let errorMessage = 'Failed to assign warehouse';
      if (err.data?.detail && Array.isArray(err.data.detail)) {
        errorMessage = err.data.detail.map((e: any) => `${e.loc?.join('.')}: ${e.msg}`).join(', ');
      } else if (typeof err.data?.detail === 'string') {
        errorMessage = err.data.detail;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setActionError(errorMessage);
    } finally {
      setActionLoading(false);
    }
  };

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    // Status filter - normalize both values for comparison
    if (statusFilter !== "all") {
      const orderStatus = order.status.toUpperCase().replace(/ /g, '_');
      const filterStatus = statusFilter.toUpperCase();
      
      console.log('Comparing:', { orderStatus, filterStatus, match: orderStatus === filterStatus });
      
      if (orderStatus !== filterStatus) {
        return false;
      }
    }
    
    // Date filter
    if (dateFilter !== "all-time") {
      const orderDate = new Date(order.order_date);
      const today = new Date();
      const daysAgo = {
        "last-7-days": 7,
        "last-30-days": 30,
        "last-90-days": 90,
      }[dateFilter];
      
      if (daysAgo) {
        const cutoffDate = new Date(today);
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        if (orderDate < cutoffDate) {
          return false;
        }
      }
    }
    
    // City filter
    if (cityFilter !== "all") {
      // Match city filter with deliver_city_id
      if (order.deliver_city_id?.toLowerCase() !== cityFilter.toLowerCase()) {
        return false;
      }
    }
    
    return true;
  });

  // Paginate filtered orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  // Format date function
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };
  
  // Helper function to get warehouse city (now directly from store object)
  const getWarehouseCity = (warehouseId: string | null | undefined): string | null => {
    if (!warehouseId) return null;
    
    const store = stores.find(s => s.store_id === warehouseId);
    return store?.city_name || null;
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-medium">Error loading orders</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter} disabled={loading}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="PLACED">Placed</SelectItem>
              <SelectItem value="SCHEDULED_RAIL">Scheduled Rail</SelectItem>
              <SelectItem value="IN_WAREHOUSE">In Warehouse</SelectItem>
              <SelectItem value="SCHEDULED_ROAD">Scheduled Road</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Date:</span>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="all-time">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">City:</span>
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="kandy">Kandy</SelectItem>
              <SelectItem value="colombo">Colombo</SelectItem>
              <SelectItem value="galle">Galle</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>Warehouse/Store</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => {
                const warehouseName = order.warehouse_id 
                  ? stores.find(s => s.store_id === order.warehouse_id)?.name 
                  : null;
                const warehouseCity = getWarehouseCity(order.warehouse_id);
                const orderStatus = order.status.toUpperCase();
                const isPlaced = orderStatus === 'PLACED' || orderStatus === 'PENDING';
                
                return (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{customers.get(order.customer_id) || order.customer_id}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.deliver_address}</TableCell>
                  <TableCell>
                    {isPlaced ? (
                      <span className="text-xs text-gray-400 italic">Not required yet</span>
                    ) : warehouseName && warehouseCity ? (
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{warehouseName}</span>
                        <span className="text-xs text-gray-500">{warehouseCity}</span>
                      </div>
                    ) : warehouseName ? (
                      <span className="text-sm">{warehouseName}</span>
                    ) : (
                      <span className="text-sm text-red-500 font-medium">⚠ Not assigned</span>
                    )}
                  </TableCell>
                  <TableCell>Rs {order.full_price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(order.status)}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditOrder(order)}>
                          Edit order
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                          Update status
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAssignWarehouse(order)}>
                          Assign warehouse
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteOrder(order)}
                        >
                          Delete order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(pageNumber);
                      }}
                      isActive={currentPage === pageNumber}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information for order {selectedOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order ID</Label>
                  <p className="text-sm text-gray-700 mt-1">{selectedOrder.order_id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {customers.get(selectedOrder.customer_id) || selectedOrder.customer_id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Order Date</Label>
                  <p className="text-sm text-gray-700 mt-1">{formatDate(selectedOrder.order_date)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColor(selectedOrder.status)} mt-1`}
                  >
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Delivery Address</Label>
                <p className="text-sm text-gray-700 mt-1">{selectedOrder.deliver_address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Delivery City</Label>
                  <p className="text-sm text-gray-700 mt-1">
                    {cities.find(c => c.city_id === selectedOrder.deliver_city_id)?.city_name || selectedOrder.deliver_city_id || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Warehouse/Store</Label>
                  {selectedOrder.warehouse_id ? (
                    <div className="mt-1">
                      <p className="text-sm text-gray-700 font-medium">
                        {stores.find(s => s.store_id === selectedOrder.warehouse_id)?.name || selectedOrder.warehouse_id}
                      </p>
                      {getWarehouseCity(selectedOrder.warehouse_id) && (
                        <p className="text-xs text-gray-500">
                          City: {getWarehouseCity(selectedOrder.warehouse_id)}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic mt-1">Not assigned</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Price</Label>
                  <p className="text-sm text-gray-700 mt-1">Rs {selectedOrder.full_price.toLocaleString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Customer ID</Label>
                  <p className="text-xs text-gray-500 mt-1 font-mono">{selectedOrder.customer_id}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update order details for {selectedOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
              {actionError}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deliver_address">Delivery Address</Label>
              <Input
                id="deliver_address"
                value={editForm.deliver_address}
                onChange={(e) => setEditForm({ ...editForm, deliver_address: e.target.value })}
                placeholder="Enter delivery address"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deliver_city_id">Delivery City</Label>
              <Select 
                value={editForm.deliver_city_id} 
                onValueChange={(value) => setEditForm({ ...editForm, deliver_city_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.city_id} value={city.city_id}>
                      {city.city_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="order_date">Order Date</Label>
              <Input
                id="order_date"
                type="date"
                value={editForm.order_date}
                onChange={(e) => setEditForm({ ...editForm, order_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="full_price">Price (Rs)</Label>
              <Input
                id="full_price"
                type="number"
                value={editForm.full_price}
                onChange={(e) => setEditForm({ ...editForm, full_price: parseFloat(e.target.value) || 0 })}
                placeholder="Enter price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmEditOrder}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status for order {selectedOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
              {actionError}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PLACED">Placed</SelectItem>
                  <SelectItem value="SCHEDULED_RAIL">Scheduled Rail</SelectItem>
                  <SelectItem value="IN_WAREHOUSE">In Warehouse</SelectItem>
                  <SelectItem value="SCHEDULED_ROAD">Scheduled Road</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmUpdateStatus}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Order Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete order {selectedOrder?.order_id}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
              {actionError}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteOrder();
              }}
              disabled={actionLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Order'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign Warehouse Dialog */}
      <Dialog open={isAssignWarehouseDialogOpen} onOpenChange={setIsAssignWarehouseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Warehouse/Store</DialogTitle>
            <DialogDescription>
              Assign a warehouse/store to order {selectedOrder?.order_id}
            </DialogDescription>
          </DialogHeader>
          {actionError && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
              {actionError}
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="warehouse_select">Select Warehouse/Store</Label>
              <Select 
                value={selectedWarehouseId || "none"} 
                onValueChange={(value) => setSelectedWarehouseId(value === "none" ? "" : value)}
              >
                <SelectTrigger id="warehouse_select">
                  <SelectValue placeholder="Select a warehouse/store" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Clear assignment)</SelectItem>
                  {stores.map((store) => {
                    const storeCity = getWarehouseCity(store.store_id);
                    return (
                      <SelectItem key={store.store_id} value={store.store_id}>
                        {store.name} {storeCity ? `(${storeCity})` : ''} - {store.address}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedWarehouseId && selectedWarehouseId !== "none" && (() => {
                const selectedStore = stores.find(s => s.store_id === selectedWarehouseId);
                const selectedCity = getWarehouseCity(selectedWarehouseId);
                return (
                  <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                    <p className="font-medium">Selected: {selectedStore?.name || 'Unknown'}</p>
                    {selectedCity && <p className="text-gray-500">City: {selectedCity}</p>}
                  </div>
                );
              })()}
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAssignWarehouseDialogOpen(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={confirmAssignWarehouse} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                'Assign Warehouse'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      </div>
    </DashboardLayout>
  );
}

export default OrderManagement;