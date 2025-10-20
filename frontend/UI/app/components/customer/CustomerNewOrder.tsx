import React, { useState, useEffect } from "react";
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
import { Loader2, Trash2, ShoppingCart, MapPin, Wallet, FileText, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ProductsAPI, CitiesAPI, OrdersAPI } from "~/services/api";
import { useAuth } from "~/hooks/useAuth";
import { useNavigate } from "react-router";

interface Product {
  product_type_id: string;
  product_name: string;
  space_consumption_rate: number;
}

interface City {
  city_id: string;
  city_name: string;
  province: string;
}

interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
}

type Step = 1 | 2 | 3 | 4;

export default function CustomerNewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(1000);
  
  // Delivery fields
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [street, setstreet] = useState<string>("");
  const [addressLine1, setAddressLine1] = useState<string>("");
  const [addressLine2, setAddressLine2] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");
  
  const [paymentMethod, setPaymentMethod] = useState<string>("pay-on-delivery");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsData, citiesData] = await Promise.all([
          ProductsAPI.getCatalog(),
          CitiesAPI.getList()
        ]);
        setProducts(productsData);
        setCities(citiesData);
        
        // Set default order date to 7 days from now
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 7);
        setOrderDate(minDate.toISOString().split('T')[0]);
        
        setError(null);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

  const handleAddToCart = () => {
    if (!selectedProductId) {
      alert("Please select a product");
      return;
    }
    if (quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }
    if (unitPrice <= 0) {
      alert("Please enter a valid unit price");
      return;
    }

    const product = products.find(p => p.product_type_id === selectedProductId);
    if (!product) return;

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.product.product_type_id === selectedProductId);
    
    if (existingIndex >= 0) {
      // Update existing item
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      // Add new item
      setCart([...cart, { product, quantity, unitPrice }]);
    }

    // Reset form
    setSelectedProductId("");
    setQuantity(1);
    setUnitPrice(0);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (currentStep === 1 && cart.length === 0) {
      alert("Please add at least one product to your cart");
      return;
    }
    if (currentStep === 2) {
      if (!firstName.trim() || !lastName.trim()) {
        alert("Please enter your full name");
        return;
      }
      if (!houseNumber.trim() || !street.trim() || !addressLine1.trim()) {
        alert("Please enter your complete address");
        return;
      }
      if (!selectedCityId) {
        alert("Please select a city");
        return;
      }
      if (!mobileNumber.trim()) {
        alert("Please enter your mobile number");
        return;
      }
    }
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Please add at least one product to your cart");
      return;
    }

    try {
      setSubmitting(true);
      
      const fullAddress = `${houseNumber}, ${street}, ${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${postalCode}`;
      
      // Set order date to 7 days from now
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      
      const orderData = {
        deliver_address: fullAddress,
        deliver_city_id: selectedCityId,
        order_date: minDate.toISOString(),
        items: cart.map(item => ({
          product_type_id: item.product.product_type_id,
          quantity: item.quantity,
          unit_price: item.unitPrice
        }))
      };

      await OrdersAPI.createWithItems(orderData);
      
      alert("Order placed successfully!");
      // Navigate to track orders page
      navigate("/customer/track-order");
    } catch (err: any) {
      console.error("Error placing order:", err);
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getMinDate = () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 7);
    return minDate.toISOString().split('T')[0];
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

  const renderStepper = () => {
    const steps = [
      { number: 1, label: "Select Products", icon: ShoppingCart },
      { number: 2, label: "Enter Delivery Details", icon: MapPin },
      { number: 3, label: "Payment", icon: Wallet },
      { number: 4, label: "Finish", icon: FileText },
    ];

    return (
      <div className="flex items-center justify-between mb-12 px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                  currentStep === step.number
                    ? "bg-[#5D5FEF] text-white shadow-lg"
                    : currentStep > step.number
                    ? "bg-[#5D5FEF] text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <step.icon className="w-6 h-6" />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.number ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-4 transition-all ${
                  currentStep > step.number ? "bg-[#5D5FEF]" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Select Products Section */}
            <div>
              <Card className="p-6 border-2 border-[#5D5FEF]">
                <h2 className="text-lg font-semibold mb-6">Select Products</h2>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product">Select Product</Label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger id="product" className="w-full bg-gray-50 mt-1">
                        <SelectValue placeholder="Choose product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.product_type_id} value={product.product_type_id}>
                            {product.product_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      placeholder="kg"
                      className="bg-gray-50 mt-1"
                    />
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-white text-[#5D5FEF] border-2 border-[#5D5FEF] hover:bg-[#5D5FEF] hover:text-white transition-all"
                    disabled={!selectedProductId}
                  >
                    + Add to cart
                  </Button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No products added yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-gray-500 border-b">
                            <th className="text-left pb-3 font-medium">Product</th>
                            <th className="text-center pb-3 font-medium">Quantity</th>
                            <th className="text-right pb-3 font-medium">Unit Price</th>
                            <th className="text-right pb-3 font-medium">Subtotal</th>
                            <th className="w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item, index) => (
                            <tr key={index} className="border-b">
                              <td className="py-3">{item.product.product_name}</td>
                              <td className="text-center py-3">{item.quantity}kg</td>
                              <td className="text-right py-3">{item.unitPrice.toFixed(2)}</td>
                              <td className="text-right py-3">{(item.quantity * item.unitPrice).toFixed(2)}</td>
                              <td className="py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveFromCart(index)}
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t text-lg font-semibold">
                      <span>Total</span>
                      <span>{total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </Card>

              {/* Payment Method Preview */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pay-on-delivery" id="payment" />
                    <Label htmlFor="payment" className="cursor-pointer">Pay On delivery</Label>
                  </div>
                </RadioGroup>
              </Card>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-[#5D5FEF]">
              <h2 className="text-lg font-semibold mb-6">Delivery Details</h2>

              <div className="space-y-6">
                <div>
                  <Label>Name</Label>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="bg-gray-50"
                    />
                    <Input
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <div className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="Number"
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        className="bg-gray-50"
                      />
                      <Input
                        placeholder="Street"
                        value={street}
                        onChange={(e) => setstreet(e.target.value)}
                        className="bg-gray-50"
                      />
                    </div>
                    <Input
                      placeholder="Address line 1"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="bg-gray-50"
                    />
                    <Input
                      placeholder="Address line 2"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="bg-gray-50"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        placeholder="City"
                        value={
                          selectedCityId
                            ? cities.find((c) => c.city_id === selectedCityId)?.city_name || ""
                            : ""
                        }
                        readOnly
                        className="bg-gray-100"
                      />
                      <Input
                        placeholder="Postal Code"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="bg-gray-50"
                      />
                    </div>
                    <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.city_id} value={city.city_id}>
                            {city.city_name}, {city.province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Mobile Number</Label>
                  <Input
                    type="tel"
                    placeholder="Mobile Number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="bg-gray-50 mt-2"
                  />
                </div>
              </div>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-8 border-2 border-[#5D5FEF]">
              <h2 className="text-lg font-semibold mb-6">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="pay-on-delivery" id="pay-delivery" />
                  <Label htmlFor="pay-delivery" className="cursor-pointer flex-1 font-medium">
                    Pay On delivery
                  </Label>
                </div>
              </RadioGroup>
            </Card>

            {/* Order Summary Review */}
            <Card className="p-8">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.product_name} ({item.quantity}kg)
                    </span>
                    <span className="font-medium">{(item.quantity * item.unitPrice).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-4 border-t text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)}</span>
                </div>
              </div>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="max-w-2xl mx-auto text-center py-12">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Review Your Order</h2>
              <p className="text-gray-600">Please review your order details before placing</p>
            </div>

            <Card className="p-8 text-left">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Delivery Address</h3>
                  <p className="text-gray-600">
                    {firstName} {lastName}
                    <br />
                    {houseNumber}, {street}, {addressLine1}
                    {addressLine2 && (
                      <>
                        <br />
                        {addressLine2}
                      </>
                    )}
                    <br />
                    {cities.find((c) => c.city_id === selectedCityId)?.city_name}, {postalCode}
                    <br />
                    {mobileNumber}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-2">Order Items</h3>
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm mb-2">
                      <span>
                        {item.product.product_name} ({item.quantity}kg)
                      </span>
                      <span>{(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    <strong>Payment Method:</strong> Pay On Delivery
                  </p>
                </div>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <h1 className="text-2xl font-semibold text-gray-800">Place New Order</h1>

      {/* Stepper */}
      {renderStepper()}

      {/* Step Content */}
      <div className="min-h-[500px]">{renderStepContent()}</div>

      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 pt-8 border-t">
        {currentStep > 1 && currentStep < 4 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="px-8"
          >
            Back
          </Button>
        )}
        {currentStep < 4 ? (
          <Button
            onClick={handleNext}
            className="px-8 bg-[#5D5FEF] text-white hover:bg-[#4a4bc7]"
            disabled={currentStep === 1 && cart.length === 0}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handlePlaceOrder}
            className="px-12 bg-[#5D5FEF] text-white hover:bg-[#4a4bc7]"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
