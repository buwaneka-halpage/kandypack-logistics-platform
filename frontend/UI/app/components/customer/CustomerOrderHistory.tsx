import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { OrdersAPI } from "~/services/api";

interface Order {
  order_id: string;
  customer_id: string;
  order_date: string;
  deliver_address: string;
  deliver_city_id: string;
  full_price: number;
  status: string;
  warehouse_id: string | null;
}

export default function CustomerOrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersData = await OrdersAPI.getMyOrders();
        
        // Filter for delivered orders only
        const deliveredOrders = ordersData.filter((order: Order) => 
          order.status === "DELIVERED"
        );
        setOrders(deliveredOrders);
        setFilteredOrders(deliveredOrders);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchOrders();
  }, []);

  useEffect(() => {
    let filtered = orders;

    if (selectedOrderId !== "all") {
      filtered = filtered.filter(order => order.order_id === selectedOrderId);
    }

    if (selectedDate !== "all") {
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.order_date).toLocaleDateString();
        return orderDate === new Date(selectedDate).toLocaleDateString();
      });
    }

    setFilteredOrders(filtered);
  }, [selectedOrderId, selectedDate, orders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  const getUniqueDates = () => {
    const dates = orders.map(order => formatDate(order.order_date));
    return [...new Set(dates)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Past Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center p-8 border rounded-lg">
          <p className="text-gray-500">No delivered orders yet</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex justify-end gap-4">
            <div className="w-[200px]">
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger className="bg-[#f8f9fa] border-[#e9ecef] hover:bg-[#f1f3f5] focus:ring-[#4263eb] focus:ring-1">
                  <SelectValue placeholder="Order ID" className="text-[#495057]" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-[#e9ecef] shadow-lg">
                  <SelectItem
                    value="all"
                    className="font-medium text-[#4263eb] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
                  >
                    All Orders
                  </SelectItem>
                  {orders.map((order) => (
                    <SelectItem
                      key={order.order_id}
                      value={order.order_id}
                      className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
                    >
                      {order.order_id.slice(0, 8)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[200px]">
              <Select value={selectedDate} onValueChange={setSelectedDate}>
                <SelectTrigger className="bg-[#f8f9fa] border-[#e9ecef] hover:bg-[#f1f3f5] focus:ring-[#4263eb] focus:ring-1">
                  <SelectValue
                    placeholder="Order Date"
                    className="text-[#495057]"
                  />
                </SelectTrigger>
                <SelectContent
                  align="end"
                  className="bg-white border border-[#e9ecef] shadow-lg"
                >
                  <SelectItem
                    value="all"
                    className="font-medium text-[#4263eb] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
                  >
                    All Dates
                  </SelectItem>
                  {getUniqueDates().map((date) => (
                    <SelectItem
                      key={date}
                      value={date}
                      className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
                    >
                      {date}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Orders Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Order ID</TableHead>
                  <TableHead>Delivery Address</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No orders found matching the selected filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.order_id}>
                      <TableCell className="font-medium">{order.order_id.slice(0, 12)}...</TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {order.deliver_address}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.order_date)}</TableCell>
                      <TableCell>Rs. {order.full_price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90"
                          onClick={() => {
                            // TODO: Implement order again functionality
                            alert('Order Again feature coming soon!');
                          }}
                        >
                          Order Again
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
