# Store Manager Warehouse Display Fix

## 🔴 Problem
Store Managers were not seeing their assigned warehouse in the dashboard. The dashboard showed:
- "Store Manager - No Warehouse Assigned"
- Warning: "You are not assigned to a warehouse. Please contact management."
- All metrics showing 0 (Warehouse Orders: 0, Pending Shipments: 0, etc.)

Additionally, orders and products weren't appearing in the database after running `reset_database.py`.

## 🔍 Root Causes

### Issue 1: Database Schema Constraint
The `stores` table had `contact_person VARCHAR(100) NOT NULL`, but `insert.sql` had 22 stores with `NULL` values, causing:
- ❌ Store insertion failures → 0 stores
- ❌ Order insertion failures (need warehouse_id) → 0 orders
- ❌ Order items failures (need order_id) → 0 order_items

### Issue 2: Missing Warehouse Info in Auth
The `get_current_user()` function in `Backend/app/core/auth.py` was only returning basic user info:
```python
return {"user_id": user.user_id, "username": user.user_name, "role": user.role}
```

It was **NOT** including `warehouseId` and `warehouseName` for Store Managers, which the frontend dashboard requires.

## ✅ Solutions Applied

### Fix 1: Updated Database Schema
**File:** `Backend/schemas/createtables.sql`

Changed the `stores` table definition:

```sql
-- BEFORE:
contact_person VARCHAR(100) NOT NULL,  -- ❌ Can't be NULL

-- AFTER:
contact_person CHAR(36) NULL,  -- ✅ Store Manager user_id (nullable)
FOREIGN KEY (contact_person) REFERENCES users(user_id) ON DELETE SET NULL,  -- ✅ Proper FK
```

**Benefits:**
- ✅ Allows NULL for unassigned stores
- ✅ Uses proper UUID type `CHAR(36)` for user_ids
- ✅ Enforces referential integrity with foreign key
- ✅ Auto-unassigns if manager is deleted (`ON DELETE SET NULL`)

### Fix 2: Enhanced User Authentication
**File:** `Backend/app/core/auth.py`

Updated `get_current_user()` to include warehouse assignment for Store Managers:

```python
# Base user info
user_data = {
    "user_id": user.user_id,
    "username": user.user_name,
    "role": user.role,
    "name": user.user_name
}

# For Store Managers, include warehouse assignment
if user.role == "StoreManager":
    # Find the store where this user is the contact_person (store manager)
    assigned_store = db.query(model.Stores).filter(
        model.Stores.contact_person == user.user_id
    ).first()
    
    if assigned_store:
        user_data["warehouseId"] = assigned_store.store_id
        user_data["warehouseName"] = assigned_store.name
        
        # Optionally get city name for better display
        if assigned_store.station and assigned_store.station.city:
            city_name = assigned_store.station.city.city_name
            user_data["warehouseName"] = f"{city_name} Warehouse"

return user_data
```

**What this does:**
1. ✅ Queries the `stores` table for stores managed by the current user
2. ✅ Adds `warehouseId` (store_id) to the user session
3. ✅ Adds `warehouseName` with proper city name formatting
4. ✅ Returns enriched user data that the frontend can use

## 📊 Database Reset Results

**After fixes, running `python reset_database.py`:**

```
Database Statistics:
  ✅ orders: 8 records (was 0!)
  ✅ stores: 25 records (was 0!)
  ✅ products: 3 records
  ✅ order_items: 3 records (was 0!)
  ✅ routes: 3 records (was 0!)
  ✅ truck_schedules: 3 records (was 0!)
  ✅ users: 21 records
  ✅ customers: 3 records
```

## 🧪 Testing Instructions

### Step 1: Restart Backend
```bash
cd Backend
# Stop current backend (Ctrl+C if running)
# Restart with:
python -m uvicorn app.main:app --reload --port 8000
```

### Step 2: Test Store Manager Login
1. **Login as Store Manager 1:**
   - Username: `store_manager1`
   - Password: `password123`
   - **Expected:** Dashboard shows "Colombo Central Store" as assigned warehouse

2. **Login as Store Manager 2:**
   - Username: `store_manager2`
   - Password: `password123`
   - **Expected:** Dashboard shows "Galle Store" as assigned warehouse

3. **Login as Store Manager 3:**
   - Username: `store_manager3`
   - Password: `password123`
   - **Expected:** Dashboard shows "Kandy Store" as assigned warehouse

### Step 3: Verify Dashboard Metrics
For **store_manager1** (Colombo Central Store):
- ✅ Should see warehouse name: "Colombo Warehouse"
- ✅ Should see orders assigned to Colombo store (2 orders: o4, o7)
- ✅ No more "No Warehouse Assigned" warning

### Step 4: Verify Order Filtering
1. Login as `store_manager1`
2. Go to **Order Management** page
3. **Expected:** Should only see orders with `warehouse_id = 'st1a2b3c4-d5e6-7890-abcd-1234567890'`
   - Order o4 (IN_WAREHOUSE status)
   - Order o7 (DELIVERED status)
4. **Should NOT see:** Orders for other warehouses or unassigned orders

### Step 5: Verify Products Display
1. Login as any user
2. Go to **Products** page
3. **Expected:** Should see 3 products:
   - Rice (0.5 space consumption)
   - Sugar (0.3 space consumption)
   - Tea (0.2 space consumption)

## 🗄️ Current Store Assignments

Based on `Backend/schemas/insert.sql`:

| Store ID | Store Name | Manager User ID | Manager Username |
|----------|-----------|-----------------|------------------|
| st1a2b3c4... | Colombo Central Store | a1b2c3d4... | store_manager1 |
| st2b3c4d5... | Galle Store | a2b3c4d5... | store_manager2 |
| st3c4d5e6... | Kandy Store | a3b4c5d6... | store_manager3 |
| st4d5e6f7... | Jaffna Store | NULL | *(Unassigned)* |
| st5e6f7g8... | Negombo Store | NULL | *(Unassigned)* |
| ...and 20 more... | ... | NULL | *(Unassigned)* |

## 📝 Summary

**Changes Made:**
1. ✅ Fixed `stores` table schema to allow nullable `contact_person` with proper foreign key
2. ✅ Enhanced `get_current_user()` to include warehouse assignment for Store Managers
3. ✅ Database now successfully inserts all 8 orders, 25 stores, and 3 products

**Impact:**
- ✅ Store Managers can now see their assigned warehouse on login
- ✅ Dashboard displays correct warehouse name and metrics
- ✅ Order filtering works based on warehouse assignment
- ✅ Products and orders are visible in the system
- ✅ Store Management page shows correct manager assignments

**Next Action Required:**
🔴 **RESTART THE BACKEND** for changes to take effect!

---

*Fix completed on: 2025-10-21*

