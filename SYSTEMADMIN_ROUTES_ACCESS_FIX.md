# SystemAdmin Router Management Access Fix

**Date:** October 21, 2025  
**Issue:** SystemAdmin cannot assign drivers/assistants to routes (403 Forbidden)  
**Status:** ✅ Fixed

---

## The Problem

SystemAdmin users were getting a **403 Forbidden** error when trying to assign drivers and assistants to truck schedules in the Router Management page. The error message said:

> "Only Management and assistant can update truck schedules"

The actual permission checks in both `routes.py` and `truck_schedules.py` were **not** including SystemAdmin in the allowed roles, even though error messages sometimes mentioned it.

---

## Root Cause

**Files:** 
- `Backend/app/api/routes.py` - Routes management
- `Backend/app/api/truck_schedules.py` - Truck schedule assignments (driver/assistant)

Permission checks were missing SystemAdmin:

**routes.py - BEFORE (Incorrect):**
```python
if not check_role_permission(role, ["Assistant", "Management"]):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Assistant, Management or SystemAdmin role required"  # ← Says SystemAdmin
    )
```

**truck_schedules.py - BEFORE (Incorrect):**
```python
if current_user.get("role") not in ["Assistant", "Management"]:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only Management and assistant can update truck schedules"  # ← This error!
    )
```

**The Issues:**
- Error messages mentioned SystemAdmin but actual check didn't include it ❌
- SystemAdmin was **NOT** in the permission lists!
- Using direct role check instead of `check_role_permission` function

---

## The Fix

Updated **10 endpoints total** across two files to include `"SystemAdmin"`:

### **routes.py** - 5 Endpoints Fixed:

1. **GET /routes/** - Get all routes
2. **GET /routes/{route_id}** - Get route by ID
3. **POST /routes/** - Create new route
4. **PUT /routes/{route_id}** - Update route
5. **DELETE /routes/{route_id}** - Delete route

### **truck_schedules.py** - 5 Endpoints Fixed:

1. **GET /truckSchedules/** - Get all truck schedules
2. **GET /truckSchedules/{schedule_id}** - Get schedule by ID
3. **POST /truckSchedules/** - Create truck schedule
4. **PUT /truckSchedules/{schedule_id}** - Update schedule (assign driver/assistant) ⭐
5. **DELETE /truckSchedules/{schedule_id}** - Delete schedule

### Code Changes:

**routes.py - AFTER (Correct):**
```python
if not check_role_permission(role, ["Assistant", "Management", "SystemAdmin"]):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Assistant, Management or SystemAdmin role required"
    )
```

**truck_schedules.py - AFTER (Correct):**
```python
if not check_role_permission(current_user.get("role"), ["Assistant", "Management", "SystemAdmin"]):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Only Management, Assistant or SystemAdmin can update truck schedules"
    )
```

---

## What Changed

### **routes.py** Changes:

**Line 18:** GET all routes
- Before: `["Assistant", "Management"]`
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

**Line 34:** GET route by ID
- Before: `["Assistant", "Management"]`
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

**Line 47:** POST create route
- Before: `["Assistant", "Management"]`
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

**Line 73:** PUT update route
- Before: `["Assistant", "Management"]`
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

**Line 95:** DELETE route
- Before: `["Assistant", "Management"]`
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

### **truck_schedules.py** Changes:

**Line 24:** GET all truck schedules
- Before: `["Assistant", "Management", "Driver", "WarehouseStaff"]`
- After: `["Assistant", "Management", "Driver", "WarehouseStaff", "SystemAdmin"]` ✅

**Line 44:** GET truck schedule by ID
- Before: `["Assistant", "Management", "Driver", "WarehouseStaff"]`
- After: `["Assistant", "Management", "Driver", "WarehouseStaff", "SystemAdmin"]` ✅

**Line 64:** POST create truck schedule
- Before: `["Assistant"]` only
- After: `["Assistant", "Management", "SystemAdmin"]` ✅

**Line 213:** PUT update truck schedule ⭐ **THE MAIN FIX**
- Before: Direct check `not in ["Assistant", "Management"]`
- After: `check_role_permission(role, ["Assistant", "Management", "SystemAdmin"])` ✅

**Line 311:** DELETE truck schedule
- Before: Direct check `not in ["Assistant", "Management"]`
- After: `check_role_permission(role, ["Assistant", "Management", "SystemAdmin"])` ✅

---

## Who Can Do What Now

### Routes Management

| Role | View Routes | Create Route | Edit Route | Delete Route |
|------|-------------|--------------|------------|--------------|
| **SystemAdmin** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Management** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Assistant** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **StoreManager** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Driver** | ❌ No | ❌ No | ❌ No | ❌ No |

### Truck Schedule Assignments (Driver/Assistant)

| Role | View Schedules | Create Schedule | Assign Driver/Assistant | Delete Schedule |
|------|----------------|-----------------|-------------------------|-----------------|
| **SystemAdmin** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Management** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Assistant** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Driver** | ✅ View Only | ❌ No | ❌ No | ❌ No |
| **WarehouseStaff** | ✅ View Only | ❌ No | ❌ No | ❌ No |
| **StoreManager** | ❌ No | ❌ No | ❌ No | ❌ No |

---

## Testing Steps

### 1. Restart Backend (If Running)

The backend should auto-reload if you're using `--reload` flag. If not, restart:

```bash
cd Backend
python -m uvicorn app.main:app --reload
```

### 2. Login as SystemAdmin

1. Navigate to login page
2. Login with SystemAdmin credentials
3. Verify role shows "SystemAdmin"

### 3. Access Router Management Page

1. Navigate to **Router Management** page
2. Should now load successfully ✅
3. Should see list of routes and roster management
4. Can click "Add Route" ✅
5. Can click "Assign to Route" to assign driver/assistant ✅
6. Should see the assignment dialog open ✅
7. **No more "Only Management and assistant" error!** ✅
8. Can successfully assign drivers and assistants ✅
9. Can edit existing routes ✅
10. Can delete routes ✅

### 4. Verify No Errors

Check browser console (F12):
- No 403 Forbidden errors ✅
- Routes data loads successfully ✅

---

## What SystemAdmin Can Do Now

### ✅ View All Routes & Schedules
- See complete list of delivery routes
- View route details (start city, end city, distance)
- See which store each route is assigned to
- View all truck schedules
- See driver and assistant availability/remaining hours

### ✅ Create New Routes
- Add new delivery routes
- Define start and end cities
- Set distance
- Assign to stores

### ✅ Create Truck Schedules
- Schedule new truck deliveries
- Assign trucks to routes
- Set departure date and time
- Set duration

### ✅ Assign Drivers & Assistants ⭐ **NEW!**
- Select truck schedule
- Assign driver to schedule
- Assign assistant to schedule
- System validates:
  - No overlapping assignments
  - Maximum work hours (Driver: 40h, Assistant: 60h)
  - No consecutive routes for drivers
  - Max 2 consecutive routes for assistants
  - No overlapping route times

### ✅ Edit Routes & Schedules
- Modify route details
- Change start/end cities
- Update distance
- Reassign to different stores
- Update truck schedules
- Reassign drivers/assistants

### ✅ Delete Routes & Schedules
- Remove routes that are no longer needed
- Delete truck schedules
- Clean up old or duplicate entries

---

## Files Modified

```
Backend/app/api/
├── routes.py
│   ├── get_all_routes() - Line 18 updated ✅
│   ├── get_route_by_id() - Line 34 updated ✅
│   ├── create_route() - Line 47 updated ✅
│   ├── update_route() - Line 73 updated ✅
│   └── delete_route() - Line 95 updated ✅
│
└── truck_schedules.py
    ├── get_all_truck_schedules() - Line 24 updated ✅
    ├── get_truck_schedule_by_id() - Line 44 updated ✅
    ├── create_truck_schedule() - Line 64 updated ✅
    ├── update_truck_schedule() - Line 213 updated ✅ ⭐ MAIN FIX
    └── delete_truck_schedule() - Line 311 updated ✅
```

---

## Summary

**Before:** ❌ SystemAdmin → 403 Forbidden ("Only Management and assistant can update truck schedules")  
**After:** ✅ SystemAdmin → Full Access to Routes & Truck Schedules  

**Issues Found:**
1. `routes.py` - Permission checks missing "SystemAdmin"
2. `truck_schedules.py` - Permission checks missing "SystemAdmin"
3. Some endpoints using direct role check instead of `check_role_permission()`

**Fixes Applied:**
1. Added "SystemAdmin" to all permission checks in both files
2. Converted direct role checks to use `check_role_permission()` function
3. Updated error messages to reflect new permissions

**Impact:** 
- SystemAdmin can now manage routes ✅
- SystemAdmin can now assign drivers/assistants to truck schedules ✅
- SystemAdmin can create/edit/delete truck schedules ✅
- All Router Management features now available to SystemAdmin ✅  

---

## Related Permissions

If you encounter similar issues with other pages, check these files:

```
Backend/app/api/
├── allocations.py     - Rail/Truck allocations
├── drivers.py         - Driver management
├── assistants.py      - Assistant management
├── orders.py          - Order management
├── stores.py          - Store/Warehouse management
├── train_schedules.py - Train scheduling
├── truck_schedules.py - Truck scheduling
└── routes.py          - Routes (FIXED ✅)
```

Look for permission checks like:
```python
if not check_role_permission(role, ["SomeRole", "AnotherRole"]):
```

And ensure `"SystemAdmin"` is included where appropriate!

---

**Status:** ✅ Complete - SystemAdmin now has full access to Routes!

**Next Step:** Login as SystemAdmin and try accessing the Routes page!

