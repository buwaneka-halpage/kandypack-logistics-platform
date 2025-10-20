import React from "react";
import { Button } from "../ui/button";
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

interface Order {
  id: string;
  description: string;
  orderDate: string;
  deliveryDate: string;
  amountPaid: number;
}

const orderDescription =
  "Detergent Powder - 5kg\nBiscuit Family Pack - 1kg\nSunflower Oil - 3kg";

function createOrder(id: string): Order {
  return {
    id,
    description: orderDescription,
    orderDate: "12/08/2025",
    deliveryDate: "25/08/2025",
    amountPaid: 7500.0,
  };
}

const pastOrders: Order[] = [
  createOrder("I000031"),
  createOrder("I000042"),
  createOrder("I000023"),
  createOrder("I000084"),
  createOrder("I000033"),
  createOrder("I000014"),
  createOrder("I000045"),
];

export default function CustomerOrderHistory() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Past Orders</h1>

      {/* Filters */}
      <div className="flex justify-end gap-4">
        <div className="w-[200px]">
          <Select>
            <SelectTrigger className="bg-[#f8f9fa] border-[#e9ecef] hover:bg-[#f1f3f5] focus:ring-[#4263eb] focus:ring-1">
              <SelectValue placeholder="Order ID" className="text-[#495057]" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-[#e9ecef] shadow-lg">
              <SelectItem
                value="all"
                className="font-medium text-[#4263eb] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                All
              </SelectItem>
              <SelectItem
                value="I000031"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000031
              </SelectItem>
              <SelectItem
                value="I000042"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000042
              </SelectItem>
              <SelectItem
                value="I000023"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000023
              </SelectItem>
              <SelectItem
                value="I000084"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000084
              </SelectItem>
              <SelectItem
                value="I000033"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000033
              </SelectItem>
              <SelectItem
                value="I000014"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000014
              </SelectItem>
              <SelectItem
                value="I000045"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                I000045
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-[200px]">
          <Select>
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
                All
              </SelectItem>
              <SelectItem
                value="12-08-2025"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                12/08/2025
              </SelectItem>
              <SelectItem
                value="15-08-2025"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                15/08/2025
              </SelectItem>
              <SelectItem
                value="18-08-2025"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                18/08/2025
              </SelectItem>
              <SelectItem
                value="21-08-2025"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                21/08/2025
              </SelectItem>
              <SelectItem
                value="24-08-2025"
                className="text-[#495057] px-3 py-2 cursor-pointer hover:bg-[#f1f3f5]"
              >
                24/08/2025
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Order ID</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Delivery Date</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pastOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>
                  {order.description.split("\n").map((line, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      {line}
                    </div>
                  ))}
                </TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell>{order.amountPaid.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-primary text-white hover:bg-primary/90"
                  >
                    Order Again
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
