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
import { Loader2, Trash2, ShoppingCart } from "lucide-react";
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

export default function CustomerNewOrder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form fields
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [deliveryAddress, setDeliveryAddress] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [orderDate, setOrderDate] = useState<string>("");

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

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert("Please add at least one product to your cart");
      return;
    }
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address");
      return;
    }
    if (!selectedCityId) {
      alert("Please select a city");
      return;
    }
    if (!orderDate) {
      alert("Please select an order date");
      return;
    }

    try {
      setSubmitting(true);
      
      const orderData = {
        deliver_address: deliveryAddress,
        deliver_city_id: selectedCityId,
        order_date: new Date(orderDate).toISOString(),
        items: cart.map(item => ({
          product_type_id: item.product.product_type_id,
          quantity: item.quantity,
          unit_price: item.unitPrice
        }))
      };

      await OrdersAPI.createWithItems(orderData);
      
      alert("Order placed successfully!");
      // Reset form
      setCart([]);
      setDeliveryAddress("");
      setSelectedCityId("");
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 7);
      setOrderDate(minDate.toISOString().split('T')[0]);
      
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
                  <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                    <SelectTrigger className="w-full bg-white">
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
                  <Label>Quantity (kg)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    placeholder="Enter quantity"
                    className="bg-white"
                  />
                </div>

                <div>
                  <Label>Unit Price (Rs.)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    placeholder="Enter unit price"
                    className="bg-white"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={!selectedProductId}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to cart
              </Button>
            </div>
          </Card>

          {/* Delivery Details Section */}
          <Card className="p-6 mt-6">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-4">
              <div>
                <Label>Delivery Address</Label>
                <Input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter full delivery address"
                  className="bg-white mt-1"
                />
              </div>

              <div>
                <Label>City</Label>
                <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select city" />
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

              <div>
                <Label>Preferred Delivery Date (at least 7 days from today)</Label>
                <Input
                  type="date"
                  min={getMinDate()}
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                  className="bg-white mt-1"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Order Summary Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart ({cart.length} items)
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add products to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-start py-3 border-b last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.product.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} kg × Rs. {item.unitPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          Rs. {(item.quantity * item.unitPrice).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFromCart(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Payment Method Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <RadioGroup defaultValue="pay-on-delivery" className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="pay-on-delivery"
                    id="pay-on-delivery"
                  />
                  <Label htmlFor="pay-on-delivery">Pay On Delivery</Label>
                </div>
              </RadioGroup>
            </div>
          </Card>

          <Button 
            className="w-full mt-6 bg-primary text-white hover:bg-primary/90"
            onClick={handlePlaceOrder}
            disabled={cart.length === 0 || submitting}
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
        </div>
      </div>
    </div>
  );
}
