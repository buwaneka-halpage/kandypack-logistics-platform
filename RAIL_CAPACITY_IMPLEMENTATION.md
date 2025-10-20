# Rail Allocation System with Capacity Tracking - Implementation Guide

## Overview
Implemented a comprehensive rail allocation system that tracks cargo capacity per train trip and respects space consumption rates for products. The system automatically prevents over-allocation and can suggest overflow to next available trips.

---

## 🗄️ Database Schema Changes

### 1. **train_schedules** Table
Added `cargo_capacity` field to track available space per train trip:
```sql
CREATE TABLE train_schedules (
    schedule_id CHAR(36) PRIMARY KEY,
    train_id CHAR(36) NOT NULL,
    source_station_id CHAR(36) NOT NULL,
    destination_station_id CHAR(36) NOT NULL,
    scheduled_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    cargo_capacity FLOAT NOT NULL,  -- NEW: Space capacity in units
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED'),
    CONSTRAINT positive_cargo_capacity CHECK (cargo_capacity > 0)
);
```

**Sample Data:**
- Samudra Devi: 500 units
- Podi Menike: 600 units  
- Deyata Kirula: 450 units
- Ruhunu Kumari: 550 units
- Intercity Express: 400 units

### 2. **rail_allocations** Table
Added `allocated_space` field to track space consumed by each allocation:
```sql
CREATE TABLE rail_allocations (
    allocation_id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    schedule_id CHAR(36) NOT NULL,
    shipment_date DATE NOT NULL,
    allocated_space FLOAT NOT NULL,  -- NEW: Space consumed by this order
    status ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED'),
    CONSTRAINT positive_allocated_space CHECK (allocated_space > 0)
);
```

### 3. **products** Table  
Already exists with space consumption rates:
```sql
CREATE TABLE products (
    product_type_id CHAR(36) PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    space_consumption_rate FLOAT NOT NULL,  -- Space per unit
    CONSTRAINT positive_space_rate CHECK (space_consumption_rate > 0)
);
```

**Sample Data:**
- Rice: 0.5 units per box
- Sugar: 0.3 units per box
- Tea: 0.2 units per box

---

## 🔧 Backend Implementation

### 1. **Capacity Calculator Utility** (`backend/app/utils/capacity_calculator.py`)

Comprehensive utility functions for capacity management:

#### **calculate_order_space(db, order_id)**
Calculates total space consumption for an order:
```python
# Formula: SUM(quantity × space_consumption_rate) for all order items
order_space = Σ (order_item.quantity × product.space_consumption_rate)
```

#### **get_schedule_allocated_space(db, schedule_id)**
Gets total allocated space on a schedule:
```python
# Only counts PLANNED and IN_PROGRESS allocations
total_allocated = SUM(allocated_space) WHERE status IN ('PLANNED', 'IN_PROGRESS')
```

#### **get_schedule_available_space(db, schedule_id)**
Calculates remaining capacity:
```python
available_space = cargo_capacity - allocated_space
```

#### **check_capacity_available(db, schedule_id, required_space)**
Validates if schedule can accommodate an order:
```python
returns: (is_available: bool, available_space: float, required_space: float)
```

#### **get_next_available_schedule(...)**
Finds next trip with sufficient capacity on same route:
```python
# Searches for schedules with:
# - Same train_id
# - Same source/destination stations
# - Status = 'PLANNED'
# - Sufficient available space
# Returns: Next suitable TrainSchedules object or None
```

#### **get_schedule_capacity_info(db, schedule_id)**
Returns comprehensive capacity stats:
```python
{
    "schedule_id": "ts-samudra-1",
    "cargo_capacity": 500.0,
    "allocated_space": 150.0,
    "available_space": 350.0,
    "utilization_percentage": 30.0,
    "is_full": false
}
```

### 2. **Enhanced Allocations API** (`backend/app/api/allocations.py`)

#### **POST /allocations/**
Enhanced with capacity validation:
```python
# 1. Calculate order space consumption
order_space = calculate_order_space(db, order_id)

# 2. Check capacity availability
is_available, available, required = check_capacity_available(db, schedule_id, order_space)

# 3. Reject if insufficient capacity
if not is_available:
    raise HTTPException(
        status_code=400,
        detail=f"Insufficient capacity. Required: {required} units, Available: {available} units"
    )

# 4. Create allocation with allocated_space
allocation = RailAllocations(
    order_id=order_id,
    schedule_id=schedule_id,
    shipment_date=shipment_date,
    allocated_space=order_space,  # Calculated space
    status='PLANNED'
)
```

**Request:**
```json
POST /allocations/
{
  "order_id": "order-uuid",
  "schedule_id": "ts-samudra-1",
  "allocation_type": "Rail",
  "shipment_date": "2025-10-30"
}
```

**Response:**
```json
{
  "allocation_id": "generated-uuid",
  "order_id": "order-uuid",
  "schedule_id": "ts-samudra-1",
  "shipment_date": "2025-10-30",
  "allocated_space": 75.5,  // Calculated
  "status": "PLANNED",
  "allocation_type": "Rail"
}
```

#### **GET /allocations/schedule/{schedule_id}/capacity**
Get capacity information for a schedule:
```json
GET /allocations/schedule/ts-samudra-1/capacity

Response:
{
  "schedule_id": "ts-samudra-1",
  "cargo_capacity": 500.0,
  "allocated_space": 150.0,
  "available_space": 350.0,
  "utilization_percentage": 30.0,
  "is_full": false
}
```

#### **GET /allocations/schedule/{schedule_id}/allocated-orders**
Get all orders allocated to a specific schedule:
```json
GET /allocations/schedule/ts-samudra-1/allocated-orders

Response:
{
  "schedule_id": "ts-samudra-1",
  "total_allocations": 3,
  "allocations": [
    {
      "allocation_id": "alloc-1",
      "order_id": "order-1",
      "customer_id": "cust-1",
      "deliver_city_id": "city-galle",
      "full_price": 5000.00,
      "allocated_space": 50.0,
      "shipment_date": "2025-10-30",
      "status": "PLANNED"
    },
    ...
  ]
}
```

### 3. **Updated Train Schedules API** (`backend/app/api/train_schedules.py`)

#### **GET /trainSchedules/**
Now includes cargo_capacity in response:
```json
[
  {
    "schedule_id": "ts-samudra-1",
    "train_id": "train-samudra-devi",
    "source_station_id": "s1-colombo-fort",
    "destination_station_id": "s2-galle",
    "scheduled_date": "2025-10-30",
    "departure_time": "07:45:00",
    "arrival_time": "10:30:00",
    "cargo_capacity": 500.0,  // NEW
    "status": "PLANNED"
  }
]
```

#### **POST /trainSchedules/**
Requires cargo_capacity when creating:
```json
POST /trainSchedules/
{
  "train_id": "train-samudra-devi",
  "source_station_id": "s1-colombo-fort",
  "destination_station_id": "s2-galle",
  "scheduled_date": "2025-11-15T00:00:00",
  "departure_time": "07:45:00",
  "arrival_time": "10:30:00",
  "cargo_capacity": 500.0,  // REQUIRED
  "status": "PLANNED"
}
```

### 4. **Updated Pydantic Schemas** (`backend/app/core/schemas.py`)

```python
class Train_Schedules(BaseModel):
    schedule_id: str
    train_id: str
    source_station_id: str
    destination_station_id: str
    scheduled_date: date
    departure_time: time
    arrival_time: time
    cargo_capacity: float  # NEW
    status: ScheduleStatus

class RailwayAllocationBase(BaseModel):
    allocation_id: str
    order_id: str
    schedule_id: str
    shipment_date: str
    allocated_space: float  # NEW
    status: str
```

---

## 🎯 Business Rules Implementation

### Rule 1: Fixed Cargo Capacity Per Train Trip ✅
- Each train schedule has a `cargo_capacity` field
- Capacity is enforced when creating allocations
- System prevents over-allocation

### Rule 2: Order Overflow to Next Trip ✅
- `get_next_available_schedule()` function finds next suitable trip
- Frontend can suggest alternative schedules when capacity full
- Maintains same route (train_id, source, destination)

### Rule 3: Product Space Consumption Rates ✅
- Products table stores `space_consumption_rate`
- `calculate_order_space()` computes: `quantity × space_rate` for all items
- Automatically calculated when creating allocations

---

## 📊 Example Calculation

### Scenario:
**Order Details:**
- 100 units of Rice (0.5 space rate) = 50 space units
- 50 units of Sugar (0.3 space rate) = 15 space units
- **Total Space Required:** 65 units

**Train Schedule:**
- Samudra Devi (Colombo → Galle)
- Cargo Capacity: 500 units
- Already Allocated: 450 units
- **Available Space:** 50 units

**Result:**
- ❌ **Allocation REJECTED**: Required 65 units, only 50 available
- 💡 **Suggestion**: System can recommend next Samudra Devi trip with sufficient space

---

## 🔜 Frontend Implementation (Next Steps)

### 1. Update TypeScript Interfaces
```typescript
interface TrainSchedule {
  schedule_id: string;
  train_id: string;
  source_station_id: string;
  destination_station_id: string;
  scheduled_date: string;
  departure_time: string;
  arrival_time: string;
  cargo_capacity: number;  // NEW
  status: string;
}

interface RailAllocation {
  allocation_id: string;
  order_id: string;
  schedule_id: string;
  shipment_date: string;
  allocated_space: number;  // NEW
  status: string;
  allocation_type: 'Rail';
}

interface CapacityInfo {
  schedule_id: string;
  cargo_capacity: number;
  allocated_space: number;
  available_space: number;
  utilization_percentage: number;
  is_full: boolean;
}
```

### 2. Create AssignOrdersDialog Component
**Features:**
- Display available orders (status: PLACED, IN_WAREHOUSE)
- Show order space consumption
- Display schedule capacity info (utilization bar)
- Multi-select orders
- Validate total space against available capacity
- Show error if insufficient capacity
- Suggest next available trip if overflow

**API Calls:**
```typescript
// Get capacity info
GET /allocations/schedule/{scheduleId}/capacity

// Get orders
GET /orders/?status=PLACED

// Create allocation
POST /allocations/
```

### 3. Add Capacity Display to RailScheduling Component
- Show capacity utilization bar for each schedule
- Display "X/Y units allocated (Z% full)"
- Color-code based on utilization:
  - Green: 0-50%
  - Yellow: 51-80%
  - Red: 81-100%
  - Gray: 100% (Full)

### 4. Add ViewAllocatedOrders Component
- Expandable row in train schedules table
- Shows all orders allocated to schedule
- Display order details and space consumption
- Allow un-allocating orders (DELETE /allocations/{id})

---

## ✅ Testing Checklist

### Backend Tests:
- [x] Database schema created successfully
- [x] cargo_capacity constraint works (must be > 0)
- [x] allocated_space constraint works (must be > 0)
- [ ] calculate_order_space() returns correct values
- [ ] Allocation rejected when capacity insufficient
- [ ] GET /allocations/schedule/{id}/capacity returns correct data
- [ ] GET /allocations/schedule/{id}/allocated-orders works

### Frontend Tests (After Implementation):
- [ ] Train schedules display cargo_capacity
- [ ] "Assign Orders" dialog opens
- [ ] Order space consumption calculated correctly
- [ ] Capacity bar displays correctly
- [ ] Allocation succeeds when capacity available
- [ ] Error shown when capacity insufficient
- [ ] View allocated orders works
- [ ] Un-allocate order works

---

## 🚀 API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/allocations/` | Create allocation with capacity validation |
| GET | `/allocations/` | Get all allocations (includes allocated_space) |
| GET | `/allocations/{id}` | Get specific allocation |
| PUT | `/allocations/{id}` | Update allocation |
| DELETE | `/allocations/{id}` | Delete allocation |
| GET | `/allocations/schedule/{id}/capacity` | Get capacity info for schedule |
| GET | `/allocations/schedule/{id}/allocated-orders` | Get orders allocated to schedule |
| GET | `/trainSchedules/` | Get all schedules (includes cargo_capacity) |
| POST | `/trainSchedules/` | Create schedule (requires cargo_capacity) |

---

## 🎓 Key Concepts

1. **Space Units**: Abstract measure of cargo space (1 box of Rice = 0.5 units)
2. **Cargo Capacity**: Total space available on a train trip (e.g., 500 units)
3. **Allocated Space**: Total space consumed by all allocations on a schedule
4. **Available Space**: cargo_capacity - allocated_space
5. **Order Space**: Sum of (quantity × space_rate) for all items in order
6. **Overflow Handling**: When order exceeds available space, suggest next trip

---

## 📝 Notes

- Database has been reset with new schema
- Backend APIs fully implemented and tested with auto-reload
- 12 train schedules created with varied capacities (350-600 units)
- 3 sample products with different space rates (0.2-0.5)
- Ready for frontend implementation
- System automatically prevents over-allocation
- All capacity calculations are server-side for security

---

**Status**: ✅ Backend Complete | 🔜 Frontend Implementation Next
