# Schema Updates - Warehouse Assignment Feature

## Overview
Updated database schemas and backend models to support the **Order-to-Warehouse Assignment** feature required by the frontend `OrderAssignment` component.

---

## Changes Made

### 1. Database Schema (`schemas/createtables.sql`)

**Orders Table - Added `warehouse_id` column:**

```sql
CREATE TABLE orders (
    order_id CHAR(36) PRIMARY KEY,
    customer_id CHAR(36),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    deliver_address VARCHAR(200) NOT NULL,
    status ENUM('PLACED','SCHEDULED_RAIL','IN_WAREHOUSE','SCHEDULED_ROAD','DELIVERED','FAILED') NOT NULL DEFAULT 'PLACED',
    deliver_city_id CHAR(36) NOT NULL,
    full_price FLOAT NOT NULL,
    warehouse_id CHAR(36),  -- NEW FIELD
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
    FOREIGN KEY (deliver_city_id) REFERENCES cities(city_id),
    FOREIGN KEY (warehouse_id) REFERENCES stores(store_id),  -- NEW FOREIGN KEY
    CONSTRAINT positive_price CHECK (full_price >= 0)
);
```

**Purpose:** 
- Allows orders to be assigned to specific warehouses/stores
- `NULL` value indicates unassigned orders (for Management to assign)
- Foreign key ensures referential integrity with stores table

---

### 2. Backend Model (`app/core/model.py`)

**Orders Model - Added `warehouse_id` field and relationship:**

```python
class Orders(Base):
    __tablename__ = "orders"
    order_id = Column(String(36), primary_key=True, index=True, default=generate_uuid)
    customer_id = Column(String(36), ForeignKey("customers.customer_id"))
    order_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    deliver_address = Column(String(200), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PLACED, nullable=False)
    deliver_city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    full_price = Column(Float, nullable=False)
    warehouse_id = Column(String(36), ForeignKey("stores.store_id"), nullable=True)  # NEW
    
    # Relationships
    customer = relationship("Customers", back_populates="orders")
    warehouse = relationship("Stores")  # NEW RELATIONSHIP
    items = relationship("OrderItems", back_populates="order")
    rail_allocations = relationship("RailAllocations", back_populates="order")
    truck_allocations = relationship("TruckAllocations", back_populates="order")
    
    __table_args__ = (
        CheckConstraint("full_price >= 0", name="positive_price"),
    )
```

---

### 3. Pydantic Schema (`app/core/schemas.py`)

**Order Schema - Added `warehouse_id` field:**

```python
class order(BaseModel):
    order_id: str 
    customer_id: str 
    order_date: datetime
    deliver_address: str 
    status: str 
    deliver_city_id: str 
    full_price: float 
    warehouse_id: str | None = None  # NEW FIELD (optional)

    model_config = {"from_attributes": True}
```

---

### 4. Sample Data (`schemas/insert.sql`)

**Updated to include 8 orders (3 unassigned, 5 assigned):**

```sql
-- Orders (8 orders: 3 unassigned for Management, 5 assigned to warehouses)
INSERT INTO orders (order_id, customer_id, order_date, deliver_address, status, deliver_city_id, full_price, warehouse_id) VALUES
-- Unassigned orders (PLACED status, no warehouse)
('o1b2c3d4-e5f6-7890-abcd-1234567890', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-21 08:00:00', '123 Main St, Colombo', 'PLACED', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 1500.50, NULL),
('o2b3c4d5-f6a7-8901-bcde-2345678901', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-22 09:00:00', '456 Beach Rd, Galle', 'PLACED', 'c2d3e4f5-b6c7-8901-def1-2345678901', 800.75, NULL),
('o3b4c5d6-a7b8-9012-cdef-3456789012', 'b8c9d0e1-f2a3-4567-bcd4-8901234567', '2025-10-23 10:00:00', '789 Hill St, Kandy', 'PLACED', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 2000.00, NULL),
-- Assigned orders (various statuses, assigned to warehouses)
('o4c5d6e7-f8a9-0123-bcde-4567890123', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-20 14:00:00', '123 Main St, Colombo', 'IN_WAREHOUSE', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 2200.00, 'st1a2b3c4-d5e6-7890-abcd-1234567890'),
('o5d6e7f8-a9b0-1234-cdef-5678901234', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-19 11:30:00', '456 Beach Rd, Galle', 'SCHEDULED_ROAD', 'c2d3e4f5-b6c7-8901-def1-2345678901', 3500.00, 'st2b3c4d5-e6f7-8901-bcde-2345678901'),
('o6e7f8a9-b0c1-2345-def0-6789012345', 'b8c9d0e1-f2a3-4567-bcd4-8901234567', '2025-10-18 09:15:00', '789 Hill St, Kandy', 'DELIVERED', 'c3d4e5f6-c7d8-9012-efa2-3456789012', 1200.00, 'st3c4d5e6-f7g8-9012-cdef-3456789012'),
('o7f8a9b0-c1d2-3456-efa1-7890123456', 'f6a7b8c9-d0e1-2345-fab2-6789012345', '2025-10-17 16:45:00', '123 Main St, Colombo', 'DELIVERED', 'c1d2e3f4-a5b6-7890-cdef-1234567890', 4100.00, 'st1a2b3c4-d5e6-7890-abcd-1234567890'),
('o8a9b0c1-d2e3-4567-fab2-8901234567', 'a7b8c9d0-e1f2-3456-abc3-7890123456', '2025-10-16 13:20:00', '456 Beach Rd, Galle', 'SCHEDULED_RAIL', 'c2d3e4f5-b6c7-8901-def1-2345678901', 2800.00, 'st2b3c4d5-e6f7-8901-bcde-2345678901');
```

**Data Distribution:**
- **Unassigned (warehouse_id = NULL):** 3 orders in `PLACED` status
- **Assigned to warehouses:** 5 orders in various statuses (`IN_WAREHOUSE`, `SCHEDULED_ROAD`, `DELIVERED`, `SCHEDULED_RAIL`)

---

### 5. API Endpoint (`app/api/orders.py`)

**New Endpoint - Assign Order to Warehouse:**

```python
@router.patch("/{order_id}/assign-warehouse", response_model=schemas.order, status_code=status.HTTP_200_OK)
def assign_order_to_warehouse(order_id: str, warehouse_id: str, db: db_dependency, current_user: dict = Depends(get_current_user)):
    """Assign an order to a warehouse (Management role required)"""
    role = current_user.get("role")
    if role != "Management":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management can assign orders to warehouses"
        )
    
    # Verify order exists
    order = db.query(model.Orders).filter(model.Orders.order_id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    
    # Verify warehouse exists
    warehouse = db.query(model.Stores).filter(model.Stores.store_id == warehouse_id).first()
    if not warehouse:
        raise HTTPException(status_code=404, detail=f"Warehouse {warehouse_id} not found")
    
    # Assign warehouse to order
    order.warehouse_id = warehouse_id
    
    # If order was PLACED, update status to IN_WAREHOUSE
    if order.status == model.OrderStatus.PLACED:
        order.status = model.OrderStatus.IN_WAREHOUSE
    
    db.commit()
    db.refresh(order)
    return order
```

**Endpoint Details:**
- **URL:** `PATCH /orders/{order_id}/assign-warehouse?warehouse_id={warehouse_id}`
- **Auth:** Requires Management role (JWT token)
- **Validation:** 
  - Verifies order exists
  - Verifies warehouse exists
  - Updates order status from `PLACED` to `IN_WAREHOUSE` automatically
- **Response:** Returns updated order object with warehouse_id populated

---

## Frontend Integration

The frontend `OrderAssignment` component expects:

1. **GET /orders/** - Returns all orders including `warehouse_id` field
2. **Filter unassigned:** `const unassignedOrders = allOrders.filter((order) => !order.warehouse_id);`
3. **Assign endpoint:** `OrdersAPI.assignToWarehouse(orderId, warehouseId)` 
   - Maps to: `PATCH /orders/{order_id}/assign-warehouse?warehouse_id={warehouse_id}`

---

## Migration Notes

To apply these changes to an existing database:

### Option 1: Use reset_database.py (Recommended for Development)
```bash
python reset_database.py
```
This will:
- Drop all existing tables
- Recreate from updated `createtables.sql`
- Populate with new sample data from `insert.sql`

### Option 2: Manual Migration (For Production)
```sql
-- Add warehouse_id column to existing orders table
ALTER TABLE orders ADD COLUMN warehouse_id CHAR(36) NULL;

-- Add foreign key constraint
ALTER TABLE orders 
ADD CONSTRAINT fk_orders_warehouse 
FOREIGN KEY (warehouse_id) REFERENCES stores(store_id);

-- Update existing orders as needed
UPDATE orders SET warehouse_id = NULL WHERE status = 'PLACED';
```

---

## Testing

### Test Credentials
- **Management User:** username=`management1`, password=`password123`
- **Store Manager:** username=`store_manager1`, password=`password123`

### Test Workflow

1. **Login as Management:**
   ```bash
   POST /users/login
   {
     "username": "management1",
     "password": "password123"
   }
   ```

2. **Get Unassigned Orders:**
   ```bash
   GET /orders/
   # Filter client-side for warehouse_id === null
   ```

3. **Assign Order to Warehouse:**
   ```bash
   PATCH /orders/o1b2c3d4-e5f6-7890-abcd-1234567890/assign-warehouse?warehouse_id=st1a2b3c4-d5e6-7890-abcd-1234567890
   Authorization: Bearer {token}
   ```

4. **Verify Assignment:**
   ```bash
   GET /orders/o1b2c3d4-e5f6-7890-abcd-1234567890
   # Should show warehouse_id populated and status changed to IN_WAREHOUSE
   ```

---

## Benefits

✅ **Database Integrity:** Foreign key ensures only valid warehouses can be assigned  
✅ **Workflow Support:** NULL warehouse_id clearly identifies unassigned orders  
✅ **Status Automation:** Auto-updates order status when assigned  
✅ **Role-Based Security:** Only Management can assign warehouses  
✅ **Frontend Ready:** All data structures match frontend expectations  

---

## Related Files

- `Backend/schemas/createtables.sql` - Database schema definition
- `Backend/schemas/insert.sql` - Sample data with warehouse assignments
- `Backend/app/core/model.py` - SQLAlchemy ORM models
- `Backend/app/core/schemas.py` - Pydantic validation schemas
- `Backend/app/api/orders.py` - Orders API endpoints
- `Backend/reset_database.py` - Database reset utility
- `frontend/UI/app/components/admin/OrderAssignment.tsx` - Frontend component
- `frontend/UI/app/services/api.ts` - Frontend API client

---

**Last Updated:** October 19, 2025  
**Status:** ✅ Complete and Ready for Testing
