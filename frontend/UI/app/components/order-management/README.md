# Order Management Table Component

A comprehensive order management table component built using the KandyPack Logistics Platform UI components. This component replicates the design shown in the provided image and includes all necessary functionality for managing orders.

## Features

- **📋 Data Table**: Complete order listing with Order ID, Customer, Order Date, Delivery Address, and Status
- **🎯 Filtering**: Filter by Status, Date range, and City
- **🏷️ Status Badges**: Color-coded status indicators (Dispatched, Delivered, Pending)
- **⚙️ Actions Menu**: Dropdown menu for each order with actions (View, Edit, Track, Cancel)
- **📄 Pagination**: Full pagination support for large datasets
- **📱 Responsive Design**: Mobile-friendly layout that adapts to different screen sizes
- **🎨 Consistent Styling**: Uses the same design system as the rest of the dashboard

## Components Used

This component uses only the UI components from the `/components/ui` folder:

- `Table` - Main table structure
- `Badge` - Status indicators
- `Button` - Action buttons
- `DropdownMenu` - Actions menu
- `Select` - Filter dropdowns
- `Pagination` - Page navigation

## Usage

### Standalone Usage
```tsx
import OrderManagement from "~/components/order-management/OrderManagement";

export default function OrdersPage() {
  return (
    <div className="p-4">
      <OrderManagement />
    </div>
  );
}
```

### Within Dashboard Layout
```tsx
import OrderManagementDashboard from "~/components/dashboard/OrderManagementDashboard";

export default function OrdersRoute() {
  return <OrderManagementDashboard />;
}
```

## Data Structure

The component expects order data in the following format:

```tsx
interface Order {
  id: string;
  customer: string;
  orderDate: string;
  deliveryAddress: string;
  status: "Dispatched" | "Delivered" | "Pending";
}
```

## Features Breakdown

### 1. Filtering System
- **Status Filter**: All, Dispatched, Delivered, Pending
- **Date Filter**: Last 7 days, Last 30 days, Last 90 days, All time
- **City Filter**: All, Kandy, Colombo, Galle

### 2. Status Badges
- **Delivered**: Green badge with success styling
- **Pending**: Yellow badge for pending orders
- **Dispatched**: Blue badge for dispatched orders

### 3. Actions Menu
Each row includes a dropdown menu with:
- View details
- Edit order
- Track delivery
- Cancel order (styled in red)

### 4. Pagination
- Shows 10 items per page by default
- Previous/Next navigation
- Page number indicators
- Responsive pagination controls

## Styling

The component uses:
- **Tailwind CSS** for styling
- **Custom color classes** for status badges
- **Responsive breakpoints** for mobile adaptation
- **Consistent spacing** matching the dashboard design

## File Structure

```
components/
├── order-management/
│   └── OrderManagement.tsx       # Main component
├── dashboard/
│   └── OrderManagementDashboard.tsx  # Dashboard integration
└── routes/
    └── order-management.tsx      # Route component
```

## Customization

### Adding New Filters
```tsx
const [newFilter, setNewFilter] = useState<string>("all");

// Add to filter section
<div className="flex items-center gap-2">
  <span className="text-sm font-medium text-gray-700">New Filter:</span>
  <Select value={newFilter} onValueChange={setNewFilter}>
    <SelectTrigger className="w-32">
      <SelectValue placeholder="Select" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All</SelectItem>
      <SelectItem value="option1">Option 1</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Adding New Status Types
```tsx
// Update the OrderStatus type
type OrderStatus = "Dispatched" | "Delivered" | "Pending" | "Cancelled";

// Update the status color function
const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "Dispatched":
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};
```

### Modifying Actions Menu
```tsx
<DropdownMenuContent align="end">
  <DropdownMenuItem>View details</DropdownMenuItem>
  <DropdownMenuItem>Edit order</DropdownMenuItem>
  <DropdownMenuItem>Track delivery</DropdownMenuItem>
  <DropdownMenuItem>Duplicate order</DropdownMenuItem>  {/* New action */}
  <DropdownMenuItem className="text-red-600">
    Cancel order
  </DropdownMenuItem>
</DropdownMenuContent>
```

## Integration with Backend

To connect with a real backend API:

```tsx
// Replace the static orderData with API call
const [orders, setOrders] = useState<Order[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
```

## Responsive Behavior

- **Desktop**: Full table with all columns visible
- **Tablet**: Condensed view with optimized spacing
- **Mobile**: Stacked layout with horizontal scrolling for table

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Color Contrast**: High contrast colors for status badges
- **Focus Management**: Clear focus indicators

This component provides a complete, production-ready order management interface that matches the design requirements and integrates seamlessly with the existing KandyPack Logistics Platform.