# Warehouse with City Display - Feature Update

## Overview
Enhanced the warehouse/store display to show the city of each warehouse, with intelligent handling based on order status.

## Business Logic Implemented

### Order Status-Based Display Rules:

1. **PLACED Orders** (Status = "PLACED" or "PENDING")
   - Display: `"Not required yet"` (gray italic text)
   - Reasoning: Orders that are just placed don't need warehouse assignment yet

2. **Non-PLACED Orders WITH Warehouse Assigned**
   - Display: Warehouse name (bold) + City name (smaller, gray text below)
   - Example:
     ```
     Colombo Central Store
     Colombo
     ```

3. **Non-PLACED Orders WITHOUT Warehouse** ⚠️
   - Display: `"⚠ Not assigned"` (red text with warning icon)
   - Reasoning: These orders SHOULD have a warehouse but don't - needs attention

## Technical Implementation

### Data Flow

```
Store → Railway Station → City
```

The relationship chain:
- `Orders.warehouse_id` → `Stores.store_id`
- `Stores.station_id` → `RailwayStations.station_id`
- `RailwayStations.city_id` → `Cities.city_id`

### New Code Components

#### 1. Added RailwayStation Interface
```typescript
interface RailwayStation {
  station_id: string;
  station_name: string;
  city_id: string;
}
```

#### 2. Helper Function: `getWarehouseCity()`
```typescript
const getWarehouseCity = (warehouseId: string | null | undefined): string | null => {
  if (!warehouseId) return null;
  
  const store = stores.find(s => s.store_id === warehouseId);
  if (!store) return null;
  
  const station = railwayStations.find(st => st.station_id === store.station_id);
  if (!station) return null;
  
  const city = cities.find(c => c.city_id === station.city_id);
  return city?.city_name || null;
};
```

This function:
- Takes a warehouse_id
- Finds the store
- Finds the railway station linked to that store
- Finds the city linked to that station
- Returns the city name

#### 3. Enhanced Data Fetching
```typescript
const [ordersData, customersData, storesData, citiesData, stationsData] = await Promise.all([
  OrdersAPI.getAll(),
  CustomersAPI.getAll(),
  StoresAPI.getAll(),
  CitiesAPI.getAll(),
  RailwayStationsAPI.getAll()  // NEW
]);
```

Now fetches railway stations data in parallel with other data.

### UI Updates

#### Orders Table Column
```tsx
<TableCell>
  {isPlaced ? (
    <span className="text-xs text-gray-400 italic">Not required yet</span>
  ) : warehouseName && warehouseCity ? (
    <div className="flex flex-col">
      <span className="text-sm font-medium">{warehouseName}</span>
      <span className="text-xs text-gray-500">{warehouseCity}</span>
    </div>
  ) : warehouseName ? (
    <span className="text-sm">{warehouseName}</span>
  ) : (
    <span className="text-sm text-red-500 font-medium">⚠ Not assigned</span>
  )}
</TableCell>
```

Logic flow:
1. Check if order is PLACED → show "Not required yet"
2. Check if warehouse AND city exist → show both (stacked)
3. Check if only warehouse exists → show warehouse name only
4. Otherwise → show red warning

#### View Details Dialog
Enhanced to show warehouse city:
```tsx
{selectedOrder.warehouse_id ? (
  <div className="mt-1">
    <p className="text-sm text-gray-700 font-medium">
      {stores.find(s => s.store_id === selectedOrder.warehouse_id)?.name}
    </p>
    {getWarehouseCity(selectedOrder.warehouse_id) && (
      <p className="text-xs text-gray-500">
        City: {getWarehouseCity(selectedOrder.warehouse_id)}
      </p>
    )}
  </div>
) : (
  <p className="text-sm text-gray-400 italic mt-1">Not assigned</p>
)}
```

#### Assign Warehouse Dialog
Each warehouse option now shows city in parentheses:
```tsx
{stores.map((store) => {
  const storeCity = getWarehouseCity(store.store_id);
  return (
    <SelectItem key={store.store_id} value={store.store_id}>
      {store.name} {storeCity ? `(${storeCity})` : ''} - {store.address}
    </SelectItem>
  );
})}
```

Example display: `Colombo Central Store (Colombo) - 123 Main St`

Selected warehouse shows enhanced info:
```tsx
{selectedWarehouseId && (
  <div className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
    <p className="font-medium">Selected: {selectedStore?.name}</p>
    {selectedCity && <p className="text-gray-500">City: {selectedCity}</p>}
  </div>
)}
```

## Visual Examples

### Table Display Scenarios

#### Scenario 1: PLACED Order
```
┌──────────────┬──────────────┬────────────────────┐
│ Order ID     │ Status       │ Warehouse/Store    │
├──────────────┼──────────────┼────────────────────┤
│ o1b2c3d4...  │ PLACED       │ Not required yet   │
└──────────────┴──────────────┴────────────────────┘
```

#### Scenario 2: IN_WAREHOUSE with Assigned Warehouse
```
┌──────────────┬──────────────┬────────────────────┐
│ Order ID     │ Status       │ Warehouse/Store    │
├──────────────┼──────────────┼────────────────────┤
│ o2b3c4d5...  │ IN WAREHOUSE │ Colombo Store      │
│              │              │ Colombo            │
└──────────────┴──────────────┴────────────────────┘
```

#### Scenario 3: SCHEDULED_ROAD without Warehouse ⚠️
```
┌──────────────┬──────────────┬────────────────────┐
│ Order ID     │ Status       │ Warehouse/Store    │
├──────────────┼──────────────┼────────────────────┤
│ o3b4c5d6...  │ SCHEDULED    │ ⚠ Not assigned     │
│              │ ROAD         │ (red text)         │
└──────────────┴──────────────┴────────────────────┘
```

## Benefits

### 1. **Visual Clarity**
- Immediately see which city each warehouse is in
- Helps logistics planning and tracking

### 2. **Status-Aware Display**
- PLACED orders don't clutter with "Not assigned" warnings
- Only shows warnings when warehouse SHOULD be assigned

### 3. **Better Decision Making**
- When assigning warehouses, can see city in dropdown
- Helps assign orders to nearest warehouse

### 4. **Problem Identification**
- Red warning highlights orders that need warehouse assignment
- Easy to spot issues in the orders table

## Database Relationships Verified

```
Orders Table
├─ warehouse_id (FK) → Stores.store_id
│
Stores Table
├─ station_id (FK) → RailwayStations.station_id
│
RailwayStations Table
├─ city_id (FK) → Cities.city_id
│
Cities Table
└─ city_name (final display value)
```

All relationships are properly defined with foreign keys, ensuring data integrity.

## API Endpoints Used

1. `GET /orders` - Fetch all orders with warehouse_id
2. `GET /stores` - Fetch all warehouses/stores with station_id
3. `GET /railway_stations` - Fetch all stations with city_id (NEW)
4. `GET /cities` - Fetch all cities with city_name
5. `PUT /orders/{order_id}` - Update order warehouse assignment

## Testing Checklist

### Display Tests
- [ ] PLACED order shows "Not required yet"
- [ ] PENDING order shows "Not required yet"
- [ ] IN_WAREHOUSE order with warehouse shows name + city
- [ ] SCHEDULED_RAIL order with warehouse shows name + city
- [ ] SCHEDULED_ROAD order without warehouse shows red warning "⚠ Not assigned"
- [ ] DELIVERED order with warehouse shows name + city

### Dialog Tests
- [ ] View Details dialog shows warehouse with city
- [ ] Assign Warehouse dropdown shows city for each option
- [ ] Selected warehouse shows city in info box below dropdown
- [ ] After assigning warehouse, table updates to show city

### Edge Cases
- [ ] Order with warehouse_id but store not found (should show just ID)
- [ ] Store with station_id but station not found (should show just name)
- [ ] Station with city_id but city not found (should show just name)
- [ ] Order with null warehouse_id (PLACED: "Not required yet", others: red warning)

## Files Modified

1. **frontend/UI/app/components/order-management/OrderManagement.tsx**
   - Added RailwayStation interface
   - Added railwayStations state
   - Added RailwayStationsAPI.getAll() to data fetching
   - Created getWarehouseCity() helper function
   - Enhanced table cell to show warehouse + city with status-based logic
   - Updated View Details dialog to show city
   - Enhanced Assign Warehouse dialog to show cities in dropdown

## Performance Considerations

### Data Fetching
- All data (orders, customers, stores, cities, stations) fetched in parallel
- No sequential API calls - optimal performance

### Lookups
- Uses JavaScript `Array.find()` for lookups
- Acceptable performance for typical dataset sizes (< 1000 items)
- For larger datasets, could optimize with Map/HashMap

### Future Optimization (if needed)
```typescript
// Create lookup maps for O(1) access
const storeMap = new Map(stores.map(s => [s.store_id, s]));
const stationMap = new Map(railwayStations.map(st => [st.station_id, st]));
const cityMap = new Map(cities.map(c => [c.city_id, c]));
```

## Summary

✅ **Warehouse display enhanced** - Shows city name below warehouse name
✅ **Status-aware logic** - PLACED orders show "Not required yet"
✅ **Warning system** - Non-PLACED orders without warehouse show red warning
✅ **Improved UX** - City shown in all dialogs and dropdowns
✅ **Data integrity** - Uses proper database relationships
✅ **Parallel data fetching** - Optimal API performance

The system now provides clear, actionable warehouse information that helps logistics staff make better decisions!
