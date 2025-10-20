import React, { useState, useEffect } from 'react';
import { MapPin, MoreVertical, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { OrdersAPI } from '~/services/api';

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

export default function CustomerTrackMyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const ordersData = await OrdersAPI.getMyOrders();
        
        // Filter for active orders (not DELIVERED or FAILED)
        const activeOrders = ordersData.filter((order: Order) => 
          order.status !== "DELIVERED" && order.status !== "FAILED"
        );
        setOrders(activeOrders);
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'SCHEDULED_ROAD':
      case 'SCHEDULED_RAIL':
        return 'Your Order Is On The Way';
      case 'IN_WAREHOUSE':
        return 'Your Order Is Ready To Be Dispatched';
      case 'PLACED':
        return 'Your Order Is Being Processed';
      default:
        return `Order Status: ${status}`;
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'PLACED':
        return 25;
      case 'SCHEDULED_RAIL':
        return 50;
      case 'IN_WAREHOUSE':
        return 65;
      case 'SCHEDULED_ROAD':
        return 85;
      default:
        return 25;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
      <h1 className="text-2xl font-semibold">Active Orders</h1>
      
      {orders.length === 0 ? (
        <Card className="p-8">
          <div className="text-center text-gray-500">
            <p className="text-lg">No active orders</p>
            <p className="text-sm mt-2">You don't have any active orders at the moment</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.order_id} className="p-6">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">
                      {getStatusDisplay(order.status)}
                    </h2>
                    <Button variant="link" className="p-0 h-auto text-primary hover:text-primary/90">
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Order Details */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="text-gray-600">Order #{order.order_id.slice(0, 8)}</div>
                    <div className="text-sm text-gray-500">Status: {order.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Amount: Rs. {order.full_price.toFixed(2)}</div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>To: {order.deliver_address}</span>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 rounded-full bg-primary"
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                  
                  {/* Timeline Points */}
                  <div className="flex justify-between mt-2 text-sm">
                    <div>
                      <div className="font-medium">Ordered</div>
                      <div className="text-gray-600">{formatDate(order.order_date)}</div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">Est. Delivery</div>
                      <div className="text-gray-600">
                        {order.status === 'SCHEDULED_ROAD' 
                          ? 'Soon' 
                          : 'TBD'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}