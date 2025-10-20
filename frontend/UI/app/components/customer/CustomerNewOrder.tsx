import React, { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Package } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface Product {
  name: string;
  quantity: string;
  unitPrice: number;
  subtotal: number;
}

export default function CustomerNewOrder() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([
    {
      name: "Detergent Powder",
      quantity: "5kg",
      unitPrice: 1000.0,
      subtotal: 5000.0,
    },
    {
      name: "Biscuit Family Pack",
      quantity: "1kg",
      unitPrice: 1000.0,
      subtotal: 1000.0,
    },
    {
      name: "Sunflower Oil",
      quantity: "4kg",
      unitPrice: 1000.0,
      subtotal: 4000.0,
    },
  ]);

  const total = selectedProducts.reduce(
    (sum, product) => sum + product.subtotal,
    0
  );

  const handleAddToCart = () => {
    // TODO: Implement add to cart logic
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold">Place New Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Select Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Select Products</h2>

            {/* Product Selection Form */}
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Select Product</Label>
                  <Select>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Choose product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="detergent">
                        Detergent Powder
                      </SelectItem>
                      <SelectItem value="biscuit">
                        Biscuit Family Pack
                      </SelectItem>
                      <SelectItem value="oil">Sunflower Oil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quantity</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="Enter quantity"
                      className="bg-white"
                    />
                    <span className="text-sm text-gray-500">kg</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                + Add to cart
              </Button>
            </div>
          </Card>

          {/* Delivery Details Section */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <Input placeholder="First name" className="bg-white mt-1" />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input placeholder="Last name" className="bg-white mt-1" />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label>Address Line 1</Label>
                  <Input
                    placeholder="Address line 1"
                    className="bg-white mt-1"
                  />
                </div>
                <div>
                  <Label>Address Line 2</Label>
                  <Input
                    placeholder="Address line 2"
                    className="bg-white mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input placeholder="City" className="bg-white mt-1" />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input placeholder="Postal code" className="bg-white mt-1" />
                </div>
              </div>

              <div>
                <Label>Mobile Number</Label>
                <Input
                  type="tel"
                  placeholder="Mobile number"
                  className="bg-white mt-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="text-left pb-2">Product</th>
                    <th className="text-center pb-2">Quantity</th>
                    <th className="text-right pb-2">Unit Price</th>
                    <th className="text-right pb-2">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedProducts.map((product, index) => (
                    <tr key={index} className="text-sm">
                      <td className="py-2">{product.name}</td>
                      <td className="text-center py-2">{product.quantity}</td>
                      <td className="text-right py-2">
                        {product.unitPrice.toFixed(2)}
                      </td>
                      <td className="text-right py-2">
                        {product.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-medium">
                    <td colSpan={3} className="pt-4 text-right">
                      Total
                    </td>
                    <td className="pt-4 text-right">{total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Payment Method Section */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <RadioGroup defaultValue="pay-on-delivery" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="pay-on-delivery"
                    id="pay-on-delivery"
                  />
                  <Label htmlFor="pay-on-delivery">Pay On delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          <Button className="w-full mt-6 bg-primary text-white hover:bg-primary/90">
            Place Order
          </Button>
        </div>
      </div>
    </div>
  );
}
