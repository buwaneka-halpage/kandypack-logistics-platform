import * as React from "react";
import { useState } from "react";
import { MoreHorizontal, ChevronDown } from "lucide-react";

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

// Sample order data
const orderData = [
  {
    id: "100001",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100002",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Delivered" as const,
  },
  {
    id: "100003",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Pending" as const,
  },
  {
    id: "100004",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100005",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100006",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100007",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100008",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100009",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100010",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100011",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
  {
    id: "100012",
    customer: "A J Perera",
    orderDate: "21/05/2025",
    deliveryAddress: "53/4 ABC street, Kandy",
    status: "Dispatched" as const,
  },
];

type OrderStatus = "Dispatched" | "Delivered" | "Pending";

const getStatusVariant = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "default"; // Green
    case "Pending":
      return "secondary"; // Yellow/Orange
    case "Dispatched":
    default:
      return "outline"; // Gray
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Dispatched":
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

export function OrderManagement() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("last-30-days");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter orders based on selected filters
  const filteredOrders = orderData.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Paginate filtered orders
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Dispatched">Dispatched</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
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
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Delivery Address</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.deliveryAddress}</TableCell>
                <TableCell>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(order.status)}
                  >
                    {order.status}
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
            ))}
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
  );
}

export default OrderManagement;