# Frontend API Integration Guide

This document outlines the changes needed to replace dummy data with real API calls in the frontend components.

## ✅ Completed Components

### 1. OrderManagement.tsx
**Location:** `frontend/UI/app/components/order-management/OrderManagement.tsx`

**Changes Made:**
- ✅ Added imports: `OrdersAPI`, `CustomersAPI`, `useEffect`, `Loader2`
- ✅ Replaced hardcoded `orderData` array with API calls
- ✅ Added loading and error states
- ✅ Fixed property names to match backend schema (order_id, customer_id, order_date, deliver_address, full_price)
- ✅ Added customer name lookup from customer_id
- ✅ Updated status values to match backend ENUM (PLACED, SCHEDULED_RAIL, IN_WAREHOUSE, SCHEDULED_ROAD, DELIVERED, FAILED)
- ✅ Added price column display
- ✅ Added loading spinner and empty state

**API Calls:**
```typescript
const [ordersData, customersData] = await Promise.all([
  OrdersAPI.getAll(),
  CustomersAPI.getAll()
]);
```

---

## 🔄 Components Needing Updates

### 2. RailScheduling.tsx
**Location:** `frontend/UI/app/components/rail-scheduling/RailScheduling.tsx`

**Required Changes:**

1. **Add Imports:**
```typescript
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { TrainSchedulesAPI, TrainsAPI, RailwayStationsAPI } from "~/services/api";
```

2. **Replace Dummy Data with State:**
```typescript
// Remove: const scheduleData = [...]

// Add Types:
interface TrainSchedule {
  schedule_id: string;
  train_id: string;
  station_id: string;
  scheduled_date: string;
  departure_time: string;
  arrival_time: string;
  status: string;
}

interface Train {
  train_id: string;
  train_name: string;
  capacity: number;
}

interface Station {
  station_id: string;
  station_name: string;
  city_id: string;
}

// Add State:
const [schedules, setSchedules] = useState<TrainSchedule[]>([]);
const [trains, setTrains] = useState<Map<string, Train>>(new Map());
const [stations, setStations] = useState<Map<string, Station>>(new Map());
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

3. **Add useEffect to Fetch Data:**
```typescript
useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [schedulesData, trainsData, stationsData] = await Promise.all([
        TrainSchedulesAPI.getAll(),
        TrainsAPI.getAll(),
        RailwayStationsAPI.getAll()
      ]);

      setSchedules(schedulesData);

      // Create maps for quick lookup
      const trainMap = new Map<string, Train>();
      trainsData.forEach((train: Train) => {
        trainMap.set(train.train_id, train);
      });
      setTrains(trainMap);

      const stationMap = new Map<string, Station>();
      stationsData.forEach((station: Station) => {
        stationMap.set(station.station_id, station);
      });
      setStations(stationMap);
    } catch (err: any) {
      console.error('Error fetching train schedules:', err);
      setError(err.message || 'Failed to load train schedules');
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);
```

4. **Update Table Rendering:**
```typescript
// Change: scheduleData.map() -> schedules.map()
// Add loading and error states in table body
{loading ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center py-8">
      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      <p className="text-sm text-gray-500 mt-2">Loading schedules...</p>
    </TableCell>
  </TableRow>
) : schedules.length === 0 ? (
  <TableRow>
    <TableCell colSpan={6} className="text-center py-8">
      No schedules found
    </TableCell>
  </TableRow>
) : (
  schedules.map((schedule) => (
    <TableRow key={schedule.schedule_id}>
      <TableCell>{schedule.schedule_id}</TableCell>
      <TableCell>{stations.get(schedule.station_id)?.station_name || schedule.station_id}</TableCell>
      <TableCell>{schedule.departure_time}</TableCell>
      <TableCell>{schedule.arrival_time}</TableCell>
      <TableCell>{trains.get(schedule.train_id)?.capacity || 0}</TableCell>
      <TableCell>
        <Badge>{schedule.status}</Badge>
      </TableCell>
    </TableRow>
  ))
)}
```

---

### 3. LastMileDelivery.tsx
**Location:** `frontend/UI/app/components/last-mile/LastMileDelivery.tsx`

**Required Changes:**

1. **Add Imports:**
```typescript
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { TruckSchedulesAPI, TrucksAPI, RoutesAPI, DriversAPI, AssistantsAPI } from "~/services/api";
```

2. **Replace Dummy Data:**
```typescript
// Remove: const scheduleData = [...]

// Add Types:
interface TruckSchedule {
  schedule_id: string;
  route_id: string;
  truck_id: string;
  driver_id: string;
  assistant_id: string;
  scheduled_date: string;
  departure_time: string;
  duration: number;
  status: string;
}

interface Truck {
  truck_id: string;
  license_num: string;
  capacity: number;
}

interface Driver {
  driver_id: string;
  name: string;
}

interface Assistant {
  assistant_id: string;
  name: string;
}

interface Route {
  route_id: string;
  store_id: string;
  start_city_id: string;
  end_city_id: string;
  distance: number;
}

// Add State:
const [schedules, setSchedules] = useState<TruckSchedule[]>([]);
const [trucks, setTrucks] = useState<Map<string, Truck>>(new Map());
const [drivers, setDrivers] = useState<Map<string, Driver>>(new Map());
const [assistants, setAssistants] = useState<Map<string, Assistant>>(new Map());
const [routes, setRoutes] = useState<Map<string, Route>>(new Map());
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

3. **Add useEffect:**
```typescript
useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const [schedulesData, trucksData, driversData, assistantsData, routesData] = await Promise.all([
        TruckSchedulesAPI.getAll(),
        TrucksAPI.getAll(),
        DriversAPI.getAll(),
        AssistantsAPI.getAll(),
        RoutesAPI.getAll()
      ]);

      setSchedules(schedulesData);

      // Create maps for quick lookup
      const truckMap = new Map();
      trucksData.forEach((truck: Truck) => truckMap.set(truck.truck_id, truck));
      setTrucks(truckMap);

      const driverMap = new Map();
      driversData.forEach((driver: Driver) => driverMap.set(driver.driver_id, driver));
      setDrivers(driverMap);

      const assistantMap = new Map();
      assistantsData.forEach((assistant: Assistant) => assistantMap.set(assistant.assistant_id, assistant));
      setAssistants(assistantMap);

      const routeMap = new Map();
      routesData.forEach((route: Route) => routeMap.set(route.route_id, route));
      setRoutes(routeMap);
    } catch (err: any) {
      console.error('Error fetching truck schedules:', err);
      setError(err.message || 'Failed to load truck schedules');
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, []);
```

---

### 4. CustomerHome.tsx
**Location:** `frontend/UI/app/components/customer/CustomerHome.tsx`

**Required Changes:**

1. **Add Imports:**
```typescript
import { useEffect } from "react";
import { useAuth } from "~/hooks/useAuth";
import { OrdersAPI } from "~/services/api";
import { Loader2 } from "lucide-react";
```

2. **Replace Mock Data:**
```typescript
// Remove: const activeOrders = [...]; const deliveredOrders = [...];

const { user } = useAuth();
const [activeOrders, setActiveOrders] = useState<any[]>([]);
const [deliveredOrders, setDeliveredOrders] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchOrders() {
    if (!user || user.role !== 'Customer') return;

    try {
      setLoading(true);
      const orders = await OrdersAPI.getAll({ customer_id: user.customer_id });

      // Split into active and delivered
      const active = orders.filter((o: any) => o.status !== 'DELIVERED');
      const delivered = orders.filter((o: any) => o.status === 'DELIVERED');

      setActiveOrders(active);
      setDeliveredOrders(delivered);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchOrders();
}, [user]);
```

3. **Update Stats Cards:**
```typescript
<p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
<p className="text-2xl font-bold text-gray-900">{deliveredOrders.length}</p>
```

---

### 5. AdminManagement.tsx
**Location:** `frontend/UI/app/components/admin/AdminManagement.tsx`

**Required Changes:**

**Note:** There is no Users API in the current api.ts. We need to add it first.

1. **Add Users API to `frontend/UI/app/services/api.ts`:**
```typescript
// Users API (Staff Management)
export const UsersAPI = {
  async getAll() {
    return httpClient.get<any[]>('/users');
  },

  async getById(userId: string) {
    return httpClient.get<any>(`/users/${userId}`);
  },

  async create(userData: any) {
    return httpClient.post<any>('/users', userData);
  },

  async update(userId: string, updateData: any) {
    return httpClient.put<any>(`/users/${userId}`, updateData);
  },

  async delete(userId: string) {
    return httpClient.delete<any>(`/users/${userId}`);
  },
};

// Add to exports
export default {
  Auth: AuthAPI,
  Orders: OrdersAPI,
  Customers: CustomersAPI,
  Cities: CitiesAPI,
  RailwayStations: RailwayStationsAPI,
  Stores: StoresAPI,
  Products: ProductsAPI,
  Routes: RoutesAPI,
  Trains: TrainsAPI,
  TrainSchedules: TrainSchedulesAPI,
  Trucks: TrucksAPI,
  TruckSchedules: TruckSchedulesAPI,
  Drivers: DriversAPI,
  Assistants: AssistantsAPI,
  Allocations: AllocationsAPI,
  Reports: ReportsAPI,
  Users: UsersAPI, // Add this
};
```

2. **Update AdminManagement.tsx:**
```typescript
import { useEffect } from "react";
import { UsersAPI } from "~/services/api";
import { Loader2 } from "lucide-react";

// Remove: const adminData = [...]

interface User {
  user_id: string;
  user_name: string;
  role: string;
  created_at: string;
}

const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchUsers() {
    try {
      setLoading(true);
      const data = await UsersAPI.getAll();
      setUsers(data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchUsers();
}, []);
```

---

### 6. Reports.tsx
**Location:** `frontend/UI/app/components/reports/Reports.tsx`

**Required Changes:**

1. **Add Imports:**
```typescript
import { useEffect } from "react";
import { ReportsAPI } from "~/services/api";
import { Loader2 } from "lucide-react";
```

2. **Replace All Mock Data with API Calls:**

```typescript
// State for each report type
const [quarterlySales, setQuarterlySales] = useState<any>(null);
const [topItems, setTopItems] = useState<any[]>([]);
const [salesByCity, setSalesByCity] = useState<any[]>([]);
const [salesByRoute, setSalesByRoute] = useState<any[]>([]);
const [driverHours, setDriverHours] = useState<any[]>([]);
const [assistantHours, setAssistantHours] = useState<any[]>([]);
const [truckUsage, setTruckUsage] = useState<any[]>([]);
const [customerOrders, setCustomerOrders] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

// Fetch all reports
useEffect(() => {
  async function fetchReports() {
    try {
      setLoading(true);
      const currentYear = new Date().getFullYear();
      const currentQuarter = Math.floor((new Date().getMonth() + 3) / 3);
      const currentMonth = new Date().getMonth() + 1;
      const startDate = `${currentYear}-01-01`;
      const endDate = new Date().toISOString().split('T')[0];

      const [
        salesData,
        itemsData,
        cityData,
        routeData,
        driversData,
        assistantsData,
        trucksData
      ] = await Promise.all([
        ReportsAPI.quarterlySales(currentYear, currentQuarter),
        ReportsAPI.topItems(currentYear, currentQuarter, 20),
        ReportsAPI.salesByCity(startDate, endDate),
        ReportsAPI.salesByRoute(startDate, endDate),
        ReportsAPI.driverHours(startDate, endDate),
        ReportsAPI.assistantHours(startDate, endDate),
        ReportsAPI.truckUsage(currentYear, currentMonth)
      ]);

      setQuarterlySales(salesData);
      setTopItems(itemsData);
      setSalesByCity(cityData);
      setSalesByRoute(routeData);
      setDriverHours(driversData);
      setAssistantHours(assistantsData);
      setTruckUsage(trucksData);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  fetchReports();
}, []);
```

3. **Update Charts to Use Real Data:**

Replace hardcoded arrays with state variables:
- `salesByCityData` → `salesByCity`
- `mostOrderedItemsData` → `topItems`
- `workingHoursData` → `driverHours` or `assistantHours`
- `truckUsageData` → `truckUsage`
- `customerOrderHistoryData` → `customerOrders`

---

### 7. LogisticsMap.tsx
**Location:** `frontend/UI/app/components/dashboard/LogisticsMap.tsx`

**Required Changes:**

1. **Update Dummy Data Section:**
```typescript
// Remove lines 59-72 (dummy data)

// Replace with:
useEffect(() => {
  async function fetchLocations() {
    try {
      const [storesData, trucksData] = await Promise.all([
        StoresAPI.getAll(),
        TrucksAPI.getAll()
      ]);

      // Map stores to coordinates (you may need to add lat/lng to backend)
      const stores = storesData.map((store: any) => ({
        name: store.name,
        lat: store.latitude || 7.2906, // Use default if not available
        lng: store.longitude || 80.6337
      }));

      // Map trucks to coordinates (you may need real-time truck location API)
      const trucks = trucksData.filter((truck: any) => truck.is_active).map((truck: any) => ({
        id: truck.license_num,
        lat: truck.current_latitude || 7.3,
        lng: truck.current_longitude || 80.65,
        status: truck.is_active ? "Active" : "Idle"
      }));

      setLocations({ stores, trucks });
    } catch (err) {
      console.error('Error fetching location data:', err);
      // Fallback to empty arrays
      setLocations({ stores: [], trucks: [] });
    }
  }

  fetchLocations();
}, []);
```

**Note:** The backend may need to be updated to include latitude/longitude fields for stores and real-time truck locations.

---

## 📋 Summary Checklist

- [x] OrderManagement.tsx - **COMPLETED**
- [ ] RailScheduling.tsx - Needs implementation
- [ ] LastMileDelivery.tsx - Needs implementation
- [ ] CustomerHome.tsx - Needs implementation  
- [ ] AdminManagement.tsx - Needs UsersAPI added first
- [ ] Reports.tsx - Needs implementation
- [ ] LogisticsMap.tsx - Needs implementation (may require backend updates)

---

## 🔧 Common Patterns

### Pattern 1: Fetch and Display List
```typescript
const [items, setItems] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);
      const data = await API.getAll();
      setItems(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);
```

### Pattern 2: Lookup Maps for Related Data
```typescript
// When you need to display names from IDs
const [items, setItems] = useState<Item[]>([]);
const [relatedData, setRelatedData] = useState<Map<string, Related>>(new Map());

useEffect(() => {
  async function fetchData() {
    const [itemsData, relatedData] = await Promise.all([
      ItemsAPI.getAll(),
      RelatedAPI.getAll()
    ]);

    const map = new Map();
    relatedData.forEach((item: Related) => {
      map.set(item.id, item);
    });

    setItems(itemsData);
    setRelatedData(map);
  }
  fetchData();
}, []);

// Usage in render:
{relatedData.get(item.related_id)?.name || item.related_id}
```

### Pattern 3: Loading States in Tables
```typescript
<TableBody>
  {loading ? (
    <TableRow>
      <TableCell colSpan={numColumns} className="text-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-gray-400" />
        <p className="text-sm text-gray-500 mt-2">Loading...</p>
      </TableCell>
    </TableRow>
  ) : items.length === 0 ? (
    <TableRow>
      <TableCell colSpan={numColumns} className="text-center py-8 text-gray-500">
        No items found
      </TableCell>
    </TableRow>
  ) : (
    items.map((item) => (
      <TableRow key={item.id}>
        {/* Render item */}
      </TableRow>
    ))
  )}
</TableBody>
```

---

## 🚨 Known Issues & Considerations

### Backend Schema Differences
- Backend uses snake_case (order_id, customer_name)
- Frontend dummy data used camelCase (orderId, customerName)
- **Solution:** Always use backend property names

### Date Formatting
- Backend returns ISO date strings
- Frontend needs locale-specific formatting
- **Solution:** Use date formatting helper functions

### Status Values
- Backend uses uppercase ENUM values (DELIVERED, PENDING)
- Frontend dummy data used Title Case
- **Solution:** Convert status.toUpperCase() or status.replace(/_/g, ' ')

### Missing Data
- Some relationships may not exist (customer deleted, etc.)
- **Solution:** Always provide fallbacks like `customers.get(id) || id`

### Loading Performance
- Multiple API calls on page load can be slow
- **Solution:** Use Promise.all() to fetch in parallel

---

## 📚 Next Steps

1. Complete the remaining 6 components following the patterns above
2. Test each component with real backend data
3. Handle edge cases (empty results, errors, deleted references)
4. Add proper error boundaries
5. Implement retry logic for failed API calls
6. Add refresh/reload functionality
7. Consider adding React Query or SWR for better data fetching

---

**Last Updated:** October 19, 2025  
**Version:** 1.0
