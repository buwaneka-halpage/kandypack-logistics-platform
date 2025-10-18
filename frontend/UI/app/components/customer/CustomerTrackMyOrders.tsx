import React from 'react';
import { MapPin, MoreVertical } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface Order {
  id: string;
  status: 'on-the-way' | 'ready-to-dispatch';
  items: string[];
  amount: number;
  deliveryAddress: string;
  orderedDate: string;
  deliveryDate: string | 'N/A';
}

const orders: Order[] = [
  {
    id: 'I000001',
    status: 'on-the-way',
    items: [
      'Detergent Powder - 5kg',
      'Biscuit Family Pack - 1kg',
      'Sunflower Oil - 4kg'
    ],
    amount: 5000.00,
    deliveryAddress: '22 Flower Road, Colombo 02',
    orderedDate: 'Sep 12',
    deliveryDate: 'Sep 25'
  },
  {
    id: 'I000001',
    status: 'ready-to-dispatch',
    items: [
      'Detergent Powder - 3kg',
      'Sunflower Oil - 2kg'
    ],
    amount: 3000.00,
    deliveryAddress: '22 Park Road, Colombo 03',
    orderedDate: 'Sep 18',
    deliveryDate: 'N/A'
  }
];

export default function CustomerTrackMyOrders() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Active Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order, index) => (
          <Card key={index} className="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold mb-1">
                    {order.status === 'on-the-way' 
                      ? 'Your Order Is On The Way'
                      : 'Your Order Is Ready To Be Dispatched'
                    }
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
                  <div className="text-gray-600">Order {order.id}</div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">{item}</div>
                  ))}
                </div>
                <div className="text-right">
                  <div className="font-medium">Amount: Rs. {order.amount.toFixed(2)}</div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>To: {order.deliveryAddress}</span>
              </div>

              {/* Progress Bar */}
              <div className="relative">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${
                      order.status === 'on-the-way' 
                        ? 'bg-[#FF6B6B] w-3/4' 
                        : 'bg-[#6B7280] w-1/4'
                    }`}
                  />
                </div>
                
                {/* Timeline Points */}
                <div className="flex justify-between mt-2 text-sm">
                  <div>
                    <div className="font-medium">Ordered</div>
                    <div className="text-gray-600">{order.orderedDate}</div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">Delivery</div>
                    <div className="text-gray-600">{order.deliveryDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}