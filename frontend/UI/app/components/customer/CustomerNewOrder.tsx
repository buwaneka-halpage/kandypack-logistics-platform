import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Product {
  product: string;
  quantity: string;
  unitPrice: number;
  subtotal: number;
}

export default function CustomerNewOrder() {
  const [selectedProducts] = useState<Product[]>([
    {
      product: "Detergent Powder",
      quantity: "5kg",
      unitPrice: 1000.0,
      subtotal: 5000.0,
    },
    {
      product: "Special Family Pack",
      quantity: "1kg",
      unitPrice: 1500.0,
      subtotal: 1500.0,
    },
    {
      product: "Sunflower Oil",
      quantity: "4L",
      unitPrice: 1000.0,
      subtotal: 4000.0,
    },
  ]);

  const total = selectedProducts.reduce((sum, item) => sum + item.subtotal, 0);

  const handlePlaceOrder = () => {
    // Implement order placement logic here
    console.log("Placing order:", { selectedProducts, total });
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Product Selection and Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Selection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Select Products</h3>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {/* Products Table */}
            <div className="mt-4">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="text-left font-medium pb-4">Product</th>
                    <th className="text-right font-medium pb-4">Quantity</th>
                    <th className="text-right font-medium pb-4">Unit Price</th>
                    <th className="text-right font-medium pb-4">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedProducts.map((item, index) => (
                    <tr key={index}>
                      <td className="py-4">{item.product}</td>
                      <td className="py-4 text-right">{item.quantity}</td>
                      <td className="py-4 text-right">
                        {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-4 text-right">
                        {item.subtotal.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Delivery Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
            <div className="space-y-4">
              {/* Name Fields */}
              <div>
                <Label>Name</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <div>
                    <Input id="firstName" placeholder="First Name" />
                  </div>
                  <div>
                    <Input id="lastName" placeholder="Last Name" />
                  </div>
                </div>
              </div>

              {/* Address Fields */}
              <div>
                <Label>Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                  <div>
                    <Input id="number" placeholder="Number" />
                  </div>
                  <div>
                    <Input id="street" placeholder="Street" />
                  </div>
                </div>
                <div className="mt-2">
                  <Input id="addressLine1" placeholder="Address line 1" />
                </div>
                <div className="mt-2">
                  <Input id="addressLine2" placeholder="Address line 2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Input id="city" placeholder="City" />
                  </div>
                  <div>
                    <Input id="postalCode" placeholder="Postal Code" />
                  </div>
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <Label>Mobile Number</Label>
                <div className="mt-1">
                  <Input id="mobile" placeholder="Mobile Number" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

            <div className="space-y-3">
              {selectedProducts.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.product}</span>
                  <span>{item.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Payment Method</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="payment"
                  className="form-radio text-primary-600"
                  defaultChecked
                />
                <span>Pay On delivery</span>
              </label>
            </div>

            <Button className="w-full mt-6" onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
