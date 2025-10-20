# Warehouse Assignment Requirement - Implementation Summary

## Date: 2025-10-20

## Overview
Orders must have a warehouse assigned before they can be allocated to train or truck schedules. This ensures proper logistics flow and tracking throughout the delivery process.

---

## Business Rule

**Orders cannot be assigned to rail or truck schedules unless they have a warehouse assigned.**

### Rationale:
1. **Logistics Flow**: Orders need to be at a warehouse before being transported
2. **Inventory Tracking**: Warehouse assignment indicates where the order is physically located
3. **Route Planning**: System needs to know which warehouse to pick up from
4. **Capacity Planning**: Warehouse space must be allocated before transport allocation

---

## Order Lifecycle

```
1. Order Created (PLACED status)
   ↓
2. Warehouse Assigned (via Order Management)
   ↓ (warehouse_id is set)
3. Order can now be allocated to Train/Truck
   ↓
4. Allocated to Rail Schedule (SCHEDULED_RAIL status)
   ↓
5. Arrives at Destination Warehouse (IN_WAREHOUSE status)
   ↓
6. Allocated to Truck for Final Delivery (SCHEDULED_ROAD status)
   ↓
7. Delivered to Customer (DELIVERED status)
```

---

## Implementation Details

### Backend Validation

**File: `backend/app/api/allocations.py`**

Added warehouse validation in `create_allocation` endpoint:

```python
# Validate order has a warehouse assigned
if not order.warehouse_id or order.warehouse_id.strip() == "":
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=f"Order {order_id} must have a warehouse assigned before it can be allocated to a schedule. Please assign a warehouse first in Order Management."
    )
```

**Validation Flow:**
1. Check if order exists
2. ✅ **NEW**: Check if warehouse_id is set and not empty
3. Check shipment date is valid
4. Check capacity availability (for rail)
5. Create allocation if all validations pass

### Frontend Filtering

**File: `frontend/UI/app/components/rail-scheduling/AssignOrdersDialog.tsx`**

Updated order filtering to exclude orders without warehouses:

```typescript
// Filter orders that can be allocated
// Orders must have a warehouse assigned and be in the correct status
const availableOrders = ordersData.filter(
  (order: Order) => 
    (order.status === 'PLACED' || order.status === 'IN_WAREHOUSE') &&
    order.warehouse_id !== null && 
    order.warehouse_id !== undefined &&
    order.warehouse_id.trim() !== ''
);
```

**Filter Criteria:**
1. Status must be `PLACED` or `IN_WAREHOUSE`
2. ✅ **NEW**: `warehouse_id` must not be null
3. ✅ **NEW**: `warehouse_id` must not be undefined
4. ✅ **NEW**: `warehouse_id` must not be empty string

### User Interface

**Enhanced Empty State Message:**

When no orders are available, the dialog shows:
```
📦 [Package Icon]

No available orders to assign

Orders must have status PLACED or IN_WAREHOUSE
and must have a warehouse assigned

💡 Tip: Go to Order Management to assign warehouses to orders first
```

**Benefits:**
- Clear explanation of requirements
- Actionable guidance (go to Order Management)
- Visual icon for better UX

---

## How to Assign Warehouses

### Using Order Management Page:

1. Navigate to **Order Management** page
2. Find orders with status `PLACED`
3. Click **⋮** (three dots) menu on an order
4. Select **"Assign warehouse"**
5. Choose a warehouse from the dropdown
6. Click **"Assign Warehouse"** button
7. Order now has `warehouse_id` set
8. Order can now be allocated to train/truck schedules

### Warehouse Selection:

The system displays all available warehouses/stores with:
- Store name
- City location
- Full address

Example:
```
Main Warehouse (Kandy) - 123 Main Street, Kandy
Branch Store (Colombo) - 456 Branch Road, Colombo
```

---

## Error Messages

### Backend Error:
**Scenario:** Trying to create allocation for order without warehouse

**HTTP Status:** 400 Bad Request

**Error Message:**
```json
{
  "detail": "Order o4c5de67... must have a warehouse assigned before it can be allocated to a schedule. Please assign a warehouse first in Order Management."
}
```

### Frontend Behavior:
**Scenario:** Dialog shows no orders available

**Display:**
- Empty state with package icon
- Message: "No available orders to assign"
- Explanation: "Orders must have status PLACED or IN_WAREHOUSE and must have a warehouse assigned"
- Help tip: "💡 Tip: Go to Order Management to assign warehouses to orders first"

---

## Database Schema

**Orders Table:**
```sql
CREATE TABLE orders (
    order_id VARCHAR(255) PRIMARY KEY,
    customer_id VARCHAR(255) NOT NULL,
    order_date DATE NOT NULL,
    deliver_address VARCHAR(255) NOT NULL,
    status ENUM('PLACED', 'SCHEDULED_RAIL', 'IN_WAREHOUSE', 'SCHEDULED_ROAD', 'DELIVERED', 'FAILED') NOT NULL,
    deliver_city_id VARCHAR(255),
    full_price FLOAT NOT NULL,
    warehouse_id VARCHAR(255),  -- ⚠️ Can be NULL initially, REQUIRED for allocation
    FOREIGN KEY (warehouse_id) REFERENCES stores(store_id)
);
```

**Key Points:**
- `warehouse_id` is optional when creating order (can be NULL)
- `warehouse_id` becomes REQUIRED before allocation
- Foreign key ensures warehouse exists
- Warehouse assignment is done via Order Management

---

## Testing Checklist

- [x] Backend rejects allocation for order without warehouse (400 error)
- [x] Frontend filters out orders without warehouses from dialog
- [x] Empty state message explains warehouse requirement
- [x] Empty state provides actionable tip
- [ ] Verify error message appears if user somehow bypasses frontend filtering
- [ ] Test assigning warehouse via Order Management
- [ ] Verify order appears in AssignOrders dialog after warehouse assignment
- [ ] Test complete flow: create order → assign warehouse → allocate to train
- [ ] Test with orders that have warehouse_id = null vs undefined vs ""

---

## Edge Cases Handled

### 1. **Order with null warehouse_id**
- **Frontend:** Filtered out, won't appear in dialog
- **Backend:** If somehow submitted, returns 400 error

### 2. **Order with empty string warehouse_id**
- **Frontend:** Filtered out by `.trim() !== ''` check
- **Backend:** Rejected by `.strip() == ""` check

### 3. **Order with undefined warehouse_id**
- **Frontend:** Filtered out by `!== undefined` check
- **Backend:** Treated as NULL, rejected

### 4. **Warehouse removed from system**
- **Database:** Foreign key constraint prevents deletion if orders reference it
- **Alternative:** Could soft-delete warehouse but keep reference

---

## API Endpoints

### Get All Orders
```
GET /orders/
```
Returns all orders including `warehouse_id` field.

### Assign Warehouse
```
PUT /orders/{order_id}
Body: {
  ...
  "warehouse_id": "store_uuid_here"
}
```
Updates order with warehouse assignment.

### Create Allocation
```
POST /allocations/?order_id=X&schedule_id=Y&allocation_type=Rail&shipment_date=2025-10-20
```
**NEW VALIDATION:** Checks order has warehouse_id before creating allocation.

### Get Available Warehouses
```
GET /stores/
```
Returns list of all warehouses/stores available for assignment.

---

## Benefits

✅ **Data Integrity** - Ensures orders can only be allocated when logistically ready
✅ **Clear Workflow** - Enforces proper order processing sequence
✅ **Better UX** - Users see only orders that can actually be allocated
✅ **Prevents Errors** - Backend validation catches edge cases
✅ **Actionable Guidance** - Empty state tells users exactly what to do
✅ **Consistent State** - Order status and warehouse assignment stay in sync

---

## Future Enhancements

1. **Auto-assign warehouse** - Based on order's delivery city
2. **Warehouse capacity** - Track available space in warehouses
3. **Batch warehouse assignment** - Assign multiple orders at once
4. **Warehouse suggestions** - Recommend optimal warehouse based on:
   - Proximity to delivery location
   - Available capacity
   - Current workload
5. **Audit trail** - Track when warehouse was assigned and by whom

---

## Related Files

**Backend:**
- `backend/app/api/allocations.py` - Allocation creation with warehouse validation
- `backend/app/api/orders.py` - Order management including warehouse assignment
- `backend/app/core/model.py` - Database models (Orders, Stores)

**Frontend:**
- `frontend/UI/app/components/rail-scheduling/AssignOrdersDialog.tsx` - Order filtering
- `frontend/UI/app/components/order-management/OrderManagement.tsx` - Warehouse assignment UI
- `frontend/UI/app/types/allocations.ts` - TypeScript interfaces

**Documentation:**
- `WAREHOUSE_REQUIREMENT.md` (this file)
- `AUTOMATIC_ORDER_STATUS_UPDATE.md` - Order status lifecycle
- `REALTIME_CAPACITY_IMPLEMENTATION.md` - Capacity tracking

---

## Success Criteria

✅ Orders without warehouses don't appear in AssignOrders dialog
✅ Backend rejects allocation attempts for orders without warehouses
✅ Clear error messages guide users to assign warehouse first
✅ Users can easily assign warehouses via Order Management
✅ System maintains data integrity throughout order lifecycle
✅ No orders in invalid states (allocated without warehouse)

---

## Date Completed: 2025-10-20
## Status: ✅ IMPLEMENTED - Ready for testing
