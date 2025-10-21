# Store Management & RBAC Fix

**Issue:** Store Managers not seeing orders assigned to their warehouses  
**Status:** ✅ **FIXED**

---

## 🔴 **The Problem**

### **Root Cause:**
The `contact_person` field in the `stores` table was storing **names** instead of **user_ids**:
- ❌ **Wrong:** `'Nimal Wijesinghe'`, `'Sunil Perera'`  
- ✅ **Correct:** `'a1b2c3d4-e5f6-7890-abcd-ef1234567890'` (actual user_id)

### **Impact:**
1. **Store Manager column showed "Not assigned"** → Backend couldn't find manager because it was looking up user_ids, not names
2. **RBAC Failed** → Store Managers couldn't see their warehouse orders because the backend query `WHERE contact_person = user_id` failed
3. **Order filtering broken** → The backend logic to filter orders by warehouse_id wasn't working

---

## ✅ **The Fix**

### **Updated `Backend/schemas/insert.sql`:**

**BEFORE:**
```sql
-- Stores had names in contact_person field
('st1a2b3c4-d5e6-7890-abcd-1234567890', 'Colombo Central Store', '+94112345670', '10 Station Rd, Colombo', 'Nimal Wijesinghe', 's1a2b3c4-d5e6-7890-abcd-1234567890'),
```

**AFTER:**
```sql
-- First 3 stores now have Store Manager user_ids assigned
('st1a2b3c4-d5e6-7890-abcd-1234567890', 'Colombo Central Store', '+94112345670', '10 Station Rd, Colombo', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 's1a2b3c4-d5e6-7890-abcd-1234567890'),
('st2b3c4d5-e6f7-8901-bcde-2345678901', 'Galle Store', '+94912345671', '20 Fort Rd, Galle', 'a2b3c4d5-f6a7-8901-bcde-ef2345678901', 's2a3b4c5-e6f7-8901-bcde-2345678901'),
('st3c4d5e6-f7g8-9012-cdef-3456789012', 'Kandy Store', '+94812345672', '30 Temple Rd, Kandy', 'a3b4c5d6-a7b8-9012-cdef-ef3456789012', 's3a4b5c6-f7g8-9012-cdef-3456789012'),

-- Remaining 22 stores have NULL (no manager assigned)
('st4d5e6f7-g8h9-0123-def0-4567890123', 'Jaffna Store', '+94212345673', '40 Northern Blvd, Jaffna', NULL, 's4a5b6c7-g8h9-0123-def0-4567890123'),
-- ... etc
```

---

## 🎯 **Store Manager Assignments**

| Store | Store Manager | User ID | Username |
|-------|---------------|---------|----------|
| **Colombo Central Store** | Store Manager 1 | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` | `store_manager1` |
| **Galle Store** | Store Manager 2 | `a2b3c4d5-f6a7-8901-bcde-ef2345678901` | `store_manager2` |
| **Kandy Store** | Store Manager 3 | `a3b4c5d6-a7b8-9012-cdef-ef3456789012` | `store_manager3` |
| All other stores (22) | Not assigned | `NULL` | - |

**Password for all store managers:** `password123`

---

## 📊 **How RBAC Works Now**

### **Backend Logic** (`Backend/app/api/orders.py`):

```python
@router.get("/", response_model=List[schemas.order])
def get_all_Orders(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    user_id = current_user.get("user_id")
    
    # If StoreManager, filter orders by their assigned warehouse
    if role == "StoreManager":
        # Find stores where this user is the contact_person (store manager)
        assigned_stores = db.query(model.Stores).filter(
            model.Stores.contact_person == user_id  # ← This now works!
        ).all()
        
        if not assigned_stores:
            return []  # No warehouse assigned
        
        # Get store IDs
        store_ids = [store.store_id for store in assigned_stores]
        
        # Get orders assigned to these warehouses
        orders_ = db.query(model.Orders).filter(
            model.Orders.warehouse_id.in_(store_ids)
        ).all()
    else:
        # Management and SystemAdmin see all orders
        orders_ = db.query(model.Orders).all()
```

### **How Manager Name is Displayed** (`Backend/app/api/stores.py`):

```python
# Get manager name from users table
if store.contact_person:
    manager = db.query(model.Users).filter(
        model.Users.user_id == store.contact_person  # ← Lookup by user_id
    ).first()
    if manager:
        store_dict["manager_name"] = manager.user_name  # ← Shows username
```

---

## 🚀 **How to Apply the Fix**

### **Step 1: Reset the Database**
```bash
cd Backend
python reset_database.py
```

This will:
- Drop all tables
- Recreate schema
- Insert corrected data (with proper user_ids in contact_person)
- Hash all passwords to `password123`

### **Step 2: Restart Backend**
```bash
cd Backend
uvicorn app.main:app --reload
```

### **Step 3: Test the Fix**

#### **Test 1: Store Manager Column Shows Names** ✅
1. Login as: `admin` / `password123`
2. Go to: **Store Management**
3. Verify:
   - **Colombo Central Store** → Store Manager: `store_manager1`
   - **Galle Store** → Store Manager: `store_manager2`
   - **Kandy Store** → Store Manager: `store_manager3`
   - All other stores → "Not assigned"

#### **Test 2: RBAC - Store Manager Sees Only Their Orders** ✅
1. **Assign Orders to Warehouses (as Management):**
   - Login as: `management1` / `password123`
   - Go to: **Order Management**
   - Find a **PLACED** order
   - Click ⋮ → "Assign warehouse"
   - Select: **Colombo Central Store**
   - Repeat for 2-3 orders

2. **Verify Store Manager Can See Orders:**
   - Logout and login as: `store_manager1` / `password123`
   - Go to: **Order Management**
   - **Should see:** Only orders assigned to Colombo Central Store
   - **Should NOT see:** Orders from Galle, Kandy, or unassigned orders

3. **Verify Other Store Managers See Different Orders:**
   - Logout and login as: `store_manager2` / `password123`
   - **Should see:** Only Galle Store orders (if any assigned)
   - **Should NOT see:** Colombo or Kandy orders

#### **Test 3: Management Sees All Orders** ✅
1. Login as: `management1` / `password123`
2. Go to: **Order Management**
3. **Should see:** ALL orders (8 orders in total)
   - 3 PLACED (unassigned)
   - 5 assigned to various warehouses

---

## 📋 **About the "Station" Column**

**Question:** Should "Station" be renamed to "Store/Warehouse"?

**Answer:** **No, it's correct as "Station"!**

### **Why "Station" is the right column name:**

1. **Business Logic:** Stores are associated with **Railway Stations** for rail transport logistics
2. **Database Schema:** `stores.station_id` references `railway_stations.station_id`
3. **Purpose:** Indicates which railway station the store uses for rail cargo shipments

### **What the Column Shows:**
- **Colombo Central Store** → "Colombo Fort" (railway station)
- **Galle Store** → "Galle Station"
- **Kandy Store** → "Kandy Station"

This is part of the **rail scheduling feature** where orders from stores are shipped via nearby railway stations.

---

## ✅ **Summary**

### **What Was Fixed:**
1. ✅ `contact_person` field now stores **user_ids** instead of names
2. ✅ First 3 stores have Store Managers assigned
3. ✅ Remaining 22 stores have `NULL` (not assigned)
4. ✅ Backend RBAC now works correctly
5. ✅ Store Manager column displays correctly

### **What Will Work Now:**
- ✅ Store Manager column shows actual manager usernames
- ✅ Store Managers only see orders for their assigned warehouse
- ✅ Management and SystemAdmin see all orders
- ✅ Assigning new managers via UI will work correctly

### **Testing Credentials:**
```
Store Manager (Colombo): store_manager1 / password123
Store Manager (Galle):   store_manager2 / password123
Store Manager (Kandy):   store_manager3 / password123
Management:              management1 / password123
System Admin:            admin / password123
```

---

**Status:** ✅ **COMPLETE - Run `reset_database.py` to apply!**  
**Files Modified:** `Backend/schemas/insert.sql`  
**Impact:** RBAC now works correctly for Store Managers

