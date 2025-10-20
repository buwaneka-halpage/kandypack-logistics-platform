import * as React from "react";
import { useState, useEffect } from "react";
import { Loader2, Package, AlertCircle, CheckCircle2 } from "lucide-react";
import { OrdersAPI, AllocationsAPI } from "~/services/api";
import type { 
  TrainSchedule, 
  Order, 
  ScheduleCapacityInfo,
  CreateAllocationRequest 
} from "~/types/allocations";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface AssignOrdersDialogProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: TrainSchedule | null;
  trainName: string;
  sourceStationName: string;
  destinationStationName: string;
  onSuccess?: () => void;
}

export function AssignOrdersDialog({
  isOpen,
  onClose,
  schedule,
  trainName,
  sourceStationName,
  destinationStationName,
  onSuccess,
}: AssignOrdersDialogProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [capacityInfo, setCapacityInfo] = useState<ScheduleCapacityInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch available orders and capacity info
  useEffect(() => {
    if (isOpen && schedule) {
      fetchData();
    } else {
      // Reset state when dialog closes
      setSelectedOrders(new Set());
      setError(null);
      setSuccess(false);
    }
  }, [isOpen, schedule]);

  async function fetchData() {
    if (!schedule) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch orders and capacity info in parallel
      const [ordersData, capacityData] = await Promise.all([
        OrdersAPI.getAll(), // Get all orders
        AllocationsAPI.getScheduleCapacity(schedule.schedule_id),
      ]);

      // Filter orders that can be allocated
      const availableOrders = ordersData.filter(
        (order: Order) => 
          order.status === 'PLACED' || order.status === 'IN_WAREHOUSE'
      );

      setOrders(availableOrders);
      setCapacityInfo(capacityData);
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function toggleOrderSelection(orderId: string) {
    const newSelection = new Set(selectedOrders);
    if (newSelection.has(orderId)) {
      newSelection.delete(orderId);
    } else {
      newSelection.add(orderId);
    }
    setSelectedOrders(newSelection);
  }

  function toggleSelectAll() {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(o => o.order_id)));
    }
  }

  async function handleAssign() {
    if (!schedule || selectedOrders.size === 0) return;

    setSubmitting(true);
    setError(null);

    try {
      // Create allocations for each selected order
      const allocationPromises = Array.from(selectedOrders).map(orderId =>
        AllocationsAPI.create({
          order_id: orderId,
          schedule_id: schedule.schedule_id,
          allocation_type: 'Rail',
          shipment_date: schedule.scheduled_date,
        })
      );

      await Promise.all(allocationPromises);

      setSuccess(true);
      
      // Call success callback and close after a brief delay
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);

    } catch (err: any) {
      console.error("Error creating allocations:", err);
      
      // Extract error message from API response
      const errorMessage = err.data?.detail || err.message || "Failed to assign orders";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  if (!schedule) return null;

  const utilizationPercentage = capacityInfo?.utilization_percentage || 0;
  const availableSpace = capacityInfo?.available_space || 0;
  const cargoCapacity = capacityInfo?.cargo_capacity || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Orders to Train Schedule</DialogTitle>
          <DialogDescription>
            Select orders to allocate to {trainName} ({sourceStationName} → {destinationStationName})
            <br />
            Scheduled: {new Date(schedule.scheduled_date).toLocaleDateString()} at {schedule.departure_time}
          </DialogDescription>
        </DialogHeader>

        {/* Capacity Information */}
        {capacityInfo && (
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Cargo Capacity Utilization</span>
              <span className="text-sm font-semibold">
                {capacityInfo.allocated_space.toFixed(1)} / {cargoCapacity.toFixed(1)} units
                ({utilizationPercentage.toFixed(1)}%)
              </span>
            </div>
            
            <Progress value={utilizationPercentage} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total Capacity</p>
                <p className="font-semibold">{cargoCapacity.toFixed(1)} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Already Allocated</p>
                <p className="font-semibold">{capacityInfo.allocated_space.toFixed(1)} units</p>
              </div>
              <div>
                <p className="text-muted-foreground">Available Space</p>
                <p className="font-semibold text-green-600">{availableSpace.toFixed(1)} units</p>
              </div>
            </div>

            {capacityInfo.is_full && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This train schedule is at full capacity. No more orders can be allocated.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully assigned {selectedOrders.size} order(s) to this train schedule!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Orders Table */}
        <div className="border rounded-lg">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Package className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-slate-500">No available orders to assign</p>
              <p className="text-sm text-slate-400 mt-1">
                Orders must have status PLACED or IN_WAREHOUSE
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedOrders.size === orders.length && orders.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Delivery City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.order_id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.has(order.order_id)}
                        onCheckedChange={() => toggleOrderSelection(order.order_id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {order.order_id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>{order.customer_id.substring(0, 8)}...</TableCell>
                    <TableCell>{order.deliver_city_id.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <Badge variant={order.status === 'PLACED' ? 'default' : 'secondary'}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      LKR {order.full_price.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <div className="flex items-center justify-between w-full">
            <div className="text-sm text-muted-foreground">
              {selectedOrders.size > 0 && (
                <span>{selectedOrders.size} order(s) selected</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={submitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleAssign} 
                disabled={selectedOrders.size === 0 || submitting || capacityInfo?.is_full}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  `Assign ${selectedOrders.size} Order(s)`
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
