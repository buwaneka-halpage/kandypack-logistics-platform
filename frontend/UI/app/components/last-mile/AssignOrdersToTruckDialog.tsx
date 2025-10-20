import * as React from "react";
import { useState, useEffect } from "react";
import { X, Loader2, Package, MapPin, Calendar, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { OrdersAPI, AllocationsAPI } from "~/services/api";

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

interface TruckSchedule {
  schedule_id: string;
  truck_id: string;
  route_id: string;
  driver_id: string;
  assistant_id: string;
  scheduled_date: string;  // Backend returns this field
  departure_time: string;  // Backend returns this field
  duration: number;        // Backend returns duration in minutes
  status: string;
}

interface AssignOrdersToTruckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: TruckSchedule | null;
  onSuccess?: () => void;
}

export function AssignOrdersToTruckDialog({
  open,
  onOpenChange,
  schedule,
  onSuccess,
}: AssignOrdersToTruckDialogProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders that are in warehouse and ready for road transport
  useEffect(() => {
    if (open && schedule) {
      fetchOrders();
    } else {
      // Reset state when dialog closes
      setSelectedOrders(new Set());
      setError(null);
    }
  }, [open, schedule]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all orders
      const ordersData = await OrdersAPI.getAll();
      
      // Filter orders that can be allocated to trucks
      // Orders must have a warehouse assigned and be IN_WAREHOUSE status
      const availableOrders = ordersData.filter(
        (order: Order) => 
          order.status === 'IN_WAREHOUSE' &&
          order.warehouse_id !== null && 
          order.warehouse_id !== undefined &&
          order.warehouse_id.trim() !== ''
      );
      
      setOrders(availableOrders);
    } catch (err: any) {
      console.error("Error fetching orders:", err);
      // Parse API error into readable string
      setError(parseApiError(err) || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map((order) => order.order_id)));
    }
  };

  const handleAssignOrders = async () => {
    if (!schedule || selectedOrders.size === 0) return;

    try {
      setSubmitting(true);
      setError(null);

      // Create truck allocations for each selected order
      const allocationPromises = Array.from(selectedOrders).map((orderId) =>
        AllocationsAPI.create({
          order_id: orderId,
          schedule_id: schedule.schedule_id,
          allocation_type: 'Truck',
          shipment_date: schedule.scheduled_date,
        })
      );

      await Promise.all(allocationPromises);

      // Success - show alert and close dialog after brief delay
      alert(`Successfully assigned ${selectedOrders.size} order(s) to truck schedule`);
      
      setTimeout(() => {
        setSelectedOrders(new Set());
        onOpenChange(false);
        if (onSuccess) onSuccess();
      }, 500);

    } catch (err: any) {
      console.error("Error assigning orders:", err);
      // Extract and parse API error into readable string
      setError(parseApiError(err) || "Failed to assign orders");
    } finally {
      setSubmitting(false);
    }
  };

  // Helper to safely parse API / backend errors into user-friendly strings
  function parseApiError(err: any): string | null {
    if (!err) return null;

    // Axios-like error with response.data
    if (err.response && err.response.data) {
      const data = err.response.data;
      // Pydantic validation errors often are list of objects under 'detail'
      if (Array.isArray(data.detail)) {
        try {
          // Map detail objects to "loc: msg" strings
          return data.detail
            .map((d: any) => {
              if (typeof d === 'string') return d;
              const loc = Array.isArray(d.loc) ? d.loc.join('.') : d.loc;
              return `${loc}: ${d.msg}`;
            })
            .join(' | ');
        } catch (e) {
          return JSON.stringify(data.detail);
        }
      }

      // If detail is a string
      if (typeof data.detail === 'string') return data.detail;

      // Try other fields
      if (typeof data.message === 'string') return data.message;
      return JSON.stringify(data);
    }

    // Some libs attach data directly on err.data
    if (err.data) {
      const d = err.data;
      if (Array.isArray(d)) return d.map((x: any) => (x.msg ? x.msg : String(x))).join(' | ');
      if (typeof d === 'string') return d;
      if (d.detail) return JSON.stringify(d.detail);
    }

    // Fallback to message
    if (err.message) return err.message;
    return String(err);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      PLACED: "bg-blue-100 text-blue-800",
      SCHEDULED_RAIL: "bg-purple-100 text-purple-800",
      IN_WAREHOUSE: "bg-yellow-100 text-yellow-800",
      SCHEDULED_ROAD: "bg-green-100 text-green-800",
      DELIVERED: "bg-gray-100 text-gray-800",
      FAILED: "bg-red-100 text-red-800",
    };

    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Assign Orders to Truck Schedule
          </DialogTitle>
          <DialogDescription>
            Select orders to assign to this truck schedule. Orders must be in warehouse
            and ready for delivery.
          </DialogDescription>
        </DialogHeader>

        {error && !loading && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {schedule && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Schedule ID:</span>{" "}
                {schedule.schedule_id.slice(0, 8)}...
              </div>
              <div>
                <span className="font-medium">Date:</span>{" "}
                {formatDate(schedule.scheduled_date)}
              </div>
              <div>
                <span className="font-medium">Departure:</span>{" "}
                {schedule.departure_time}
              </div>
              <div>
                <span className="font-medium">Duration:</span> {schedule.duration} min
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Package className="w-12 h-12 mb-2 text-gray-400" />
              <p>No orders available for assignment</p>
              <p className="text-sm">Orders must be in warehouse status</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedOrders.size === orders.length && orders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                  <span className="text-sm font-medium">
                    Select All ({selectedOrders.size} of {orders.length} selected)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${
                      selectedOrders.has(order.order_id)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Checkbox
                      checked={selectedOrders.has(order.order_id)}
                      onCheckedChange={() => handleToggleOrder(order.order_id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            Order #{order.order_id.slice(0, 8)}...
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          Rs. {order.full_price.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-start gap-4 text-sm text-gray-600">
                        <div className="flex items-start gap-1">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span className="break-words">{order.deliver_address}</span>
                        </div>
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>{formatDate(order.order_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssignOrders}
            disabled={selectedOrders.size === 0 || submitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Assigning...
              </>
            ) : (
              `Assign ${selectedOrders.size} Order${selectedOrders.size !== 1 ? "s" : ""}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
