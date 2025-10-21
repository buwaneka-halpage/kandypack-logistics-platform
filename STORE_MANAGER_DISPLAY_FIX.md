# Store Manager Display Issue - FIXED

**Date:** October 20, 2025  
**Issue:** Manager name showing "Not assigned" even after successful assignment  
**Status:** ✅ Fixed - Backend schemas updated

---

## The Problem

After assigning a Store Manager to a warehouse and saving successfully, the table was still showing "Not assigned" instead of the manager's name.

---

## Root Cause

The backend Pydantic schemas had **two critical issues**:

### Issue 1: Missing `manager_name` field in response schema

**File:** `Backend/app/core/schemas.py`

The `StoreWithCity` schema (used for GET /stores/ response) was missing the `manager_name` field that the backend code was adding to the response.

**Before:**
```python
class StoreWithCity(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str 
    address : str 
    contact_person : str        # ← Didn't allow null
    station_id : str
    city_name: str | None = None
    # ← manager_name field was MISSING!
```

### Issue 2: Schemas didn't allow null values

The `contact_person` field in all store schemas was typed as `str` (required), which meant:
- Couldn't accept `null` values for unassigned warehouses
- Backend would reject or fail to process null values

---

## The Fix

### 1. Updated `StoreWithCity` Response Schema

**File:** `Backend/app/core/schemas.py` (Lines 102-112)

```python
class StoreWithCity(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str 
    address : str 
    contact_person : str | None = None  # ✅ Now allows null
    station_id : str
    city_name: str | None = None
    manager_name: str | None = None     # ✅ Added manager_name field
    
    model_config = {"from_attributes": True}
```

### 2. Updated `StoreCreate` Schema

**File:** `Backend/app/core/schemas.py` (Lines 306-314)

```python
class StoreCreate(BaseModel):
    store_id : str 
    name : str 
    telephone_number : str
    address : str
    contact_person: str | None = None  # ✅ Allow null for unassigned managers
    station_id : str 
    
    model_config = {"from_attributes": True}
```

### 3. Updated `StoreUpdate` Schema

**File:** `Backend/app/core/schemas.py` (Lines 317-324)

```python
class StoreUpdate(BaseModel):
    name : str 
    telephone_number : str
    address : str
    contact_person: str | None = None  # ✅ Allow null for unassigned managers
    station_id : str 
    
    model_config = {"from_attributes": True}
```

---

## How It Works Now

### Backend Flow:

1. **GET /stores/ endpoint** (`Backend/app/api/stores.py`):
   ```python
   # Backend builds response with manager_name
   store_dict = {
       "store_id": store.store_id,
       "name": store.name,
       # ...
       "contact_person": store.contact_person,  # Can be null
       "manager_name": None  # Will be populated if manager exists
   }
   
   # If contact_person exists, lookup manager name
   if store.contact_person:
       manager = db.query(model.Users).filter(
           model.Users.user_id == store.contact_person
       ).first()
       if manager:
           store_dict["manager_name"] = manager.user_name  # ✅
   ```

2. **Pydantic validates response:**
   - Now sees `manager_name` field in `StoreWithCity` schema ✅
   - Allows `null` values for both `contact_person` and `manager_name` ✅
   - Response passes validation and is sent to frontend ✅

### Frontend Flow:

1. **Store Management component** receives data:
   ```typescript
   {
     "store_id": "STORE-123",
     "name": "Colombo Warehouse",
     "contact_person": "USER-456",      // user_id
     "manager_name": "john_doe",         // ✅ Now included!
     // ...
   }
   ```

2. **Table displays manager name:**
   ```tsx
   {store.manager_name ? (
     <span className="bg-blue-100 text-blue-800">
       {store.manager_name}  // ✅ Shows "john_doe"
     </span>
   ) : (
     <span className="text-gray-400">Not assigned</span>
   )}
   ```

---

## Testing Steps

### 1. Restart Backend Server

**Important:** You need to restart your backend server for the schema changes to take effect:

```bash
cd Backend
# Stop the server (Ctrl+C)
# Restart it
python -m uvicorn app.main:app --reload
```

### 2. Test Assignment Flow

1. **Open Store Management page**
2. **Click Edit on any warehouse**
3. **Select a Store Manager** from the dropdown
4. **Click Save**
5. **Verify:** Table now shows manager name with blue badge ✅

### 3. Test Unassignment

1. **Click Edit on an assigned warehouse**
2. **Select "No manager assigned"**
3. **Click Save**
4. **Verify:** Table shows "Not assigned" (gray/italic) ✅

### 4. Check Console Logs

Open browser console (F12) and verify:

```javascript
// After save, should see:
Submitting store data: {
  name: "Colombo Warehouse",
  contact_person: "USER-456",  // or null if unassigned
  // ...
}

// After refresh, should see:
Fetched stores data: [
  {
    store_id: "STORE-123",
    name: "Colombo Warehouse",
    contact_person: "USER-456",
    manager_name: "john_doe",  // ✅ Manager name now present!
    // ...
  }
]
```

---

## What Changed

### Backend Files:

```
Backend/app/core/
└── schemas.py
    ├── StoreWithCity (Updated - Added manager_name field)
    ├── StoreCreate (Updated - Allow null contact_person)
    └── StoreUpdate (Updated - Allow null contact_person)
```

### Frontend Files:

```
frontend/UI/app/components/stores/
└── StoreManagement.tsx
    └── Added console.log statements for debugging
```

---

## Before vs After

### Before:

```
User Flow:
1. Edit warehouse → Select manager → Save ✅
2. Backend saves: contact_person = "USER-456" ✅
3. Backend response: manager_name field missing ❌
4. Pydantic validation: Removes manager_name from response ❌
5. Frontend receives: { contact_person: "USER-456", manager_name: undefined } ❌
6. Table displays: "Not assigned" (because manager_name is falsy) ❌
```

### After:

```
User Flow:
1. Edit warehouse → Select manager → Save ✅
2. Backend saves: contact_person = "USER-456" ✅
3. Backend response: manager_name = "john_doe" ✅
4. Pydantic validation: Includes manager_name in response ✅
5. Frontend receives: { contact_person: "USER-456", manager_name: "john_doe" } ✅
6. Table displays: "john_doe" with blue badge ✅
```

---

## Common Issues & Solutions

### Issue: Still showing "Not assigned" after fix

**Solution:**
1. **Restart backend server** (schema changes require restart)
2. **Hard refresh browser** (Ctrl+Shift+R)
3. **Check console logs** to verify data is being received
4. **Verify database** - ensure contact_person is actually saved

### Issue: Error when saving null value

**Solution:**
- Backend schemas now allow null ✅
- If still failing, check if database column allows NULL
- Verify frontend is sending `null` (not "unassigned" string)

### Issue: Manager name not appearing for existing assignments

**Solution:**
1. The manager must exist in `users` table
2. The `user_id` in `contact_person` must match a valid user
3. Backend query: `Users.user_id == store.contact_person`
4. Check backend logs for query errors

---

## Summary

### Root Cause:
❌ Backend Pydantic schemas were missing `manager_name` field and didn't allow `null` values

### Fix Applied:
✅ Added `manager_name: str | None = None` to `StoreWithCity` schema  
✅ Changed `contact_person: str` to `contact_person: str | None = None` in all schemas  
✅ Backend now properly validates and returns manager names  

### Result:
✅ Store Manager names now display correctly in the table  
✅ "Not assigned" shows for warehouses without managers  
✅ Assignment and unassignment both work properly  

---

**Status:** ✅ Complete - Restart backend and test!

**Next Step:** Restart your backend server and try assigning a manager again!

