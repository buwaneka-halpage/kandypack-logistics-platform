import * as React from "react";
import { useState, useEffect } from "react";
import { MoreHorizontal, ChevronDown, Loader2 } from "lucide-react";
import { OrdersAPI, CustomersAPI } from "~/services/api";

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
}

interface Customer {
  customer_id: string;
  customer_name: string;
}

type OrderStatus = "DISPATCHED" | "DELIVERED" | "PENDING" | "PLACED" | "SCHEDULED_RAIL" | "IN_WAREHOUSE" | "SCHEDULED_ROAD" | "FAILED";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("last-30-days");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch orders and customers
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch orders and customers in parallel
        const [ordersData, customersData] = await Promise.all([
          OrdersAPI.getAll(),
          CustomersAPI.getAll()
        ]);
        
        setOrders(ordersData);
        
        // Create a map of customer_id to customer_name
        const customerMap = new Map<string, string>();
        customersData.forEach((customer: Customer) => {
          customerMap.set(customer.customer_id, customer.customer_name);
        });
        setCustomers(customerMap);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter orders based on selected filters
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status.toUpperCase() !== statusFilter.toUpperCase()) {
      return false;
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
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-2">Loading orders...</p>
                </TableCell>
              </TableRow>
            ) : paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>{customers.get(order.customer_id) || order.customer_id}</TableCell>
                  <TableCell>{formatDate(order.order_date)}</TableCell>
                  <TableCell className="max-w-xs truncate">{order.deliver_address}</TableCell>
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
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit order</DropdownMenuItem>
                        <DropdownMenuItem>Track delivery</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Cancel order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
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
      </div>
    </DashboardLayout>
  );
}

export default OrderManagement;