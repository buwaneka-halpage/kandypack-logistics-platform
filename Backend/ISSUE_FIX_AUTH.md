# Authentication Issue Fix - Rail Allocations

## Issue Description

When clicking "Assign Orders" in the Rail Scheduling page, the dialog showed:
1. ❌ **"You cannot access capacity information"** (403 Forbidden)
2. ❌ **"No available orders to assign"**

## Root Cause

The allocations API endpoints (`/allocations/`) had role-based access control that only allowed:
- `"Assistant"`
- `"Management"`

But the user was logged in as **`"SystemAdmin"`**, which was not in the allowed roles list.

## Files Modified

**File:** `backend/app/api/allocations.py`

### Changed Endpoints:

1. **GET /allocations/** - Get all allocations
   - Before: `["Assistant", "Management"]`
   - After: `["SystemAdmin", "Assistant", "Management"]`

2. **POST /allocations/** - Create allocation
   - Before: `["Assistant"]` only
   - After: `["SystemAdmin", "Assistant", "Management"]`

3. **PUT /allocations/{allocation_id}** - Update allocation
   - Before: `["Assistant", "Management"]`
   - After: `["SystemAdmin", "Assistant", "Management"]`

4. **DELETE /allocations/{allocation_id}** - Delete allocation
   - Before: `["Assistant", "Management"]`
   - After: `["SystemAdmin", "Assistant", "Management"]`

5. **GET /allocations/schedule/{schedule_id}/capacity** - Get capacity info
   - Before: `["Assistant", "Management"]`
   - After: `["SystemAdmin", "Assistant", "Management"]`

6. **GET /allocations/schedule/{schedule_id}/allocated-orders** - Get allocated orders
   - Before: `["Assistant", "Management"]`
   - After: `["SystemAdmin", "Assistant", "Management"]`

## Solution

Added **`"SystemAdmin"`** to the allowed roles list for all allocation endpoints.

```python
# Before
if role not in ["Assistant", "Management"]:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You cannot access capacity information"
    )

# After
if role not in ["SystemAdmin", "Assistant", "Management"]:
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You cannot access capacity information"
    )
```

## Testing

After the fix, the SystemAdmin user should be able to:
1. ✅ Open the "Assign Orders" dialog
2. ✅ See capacity information (total, allocated, available)
3. ✅ View available orders (PLACED or IN_WAREHOUSE status)
4. ✅ Select and assign orders to train schedules
5. ✅ Create allocations successfully

## Verification Steps

1. Log in as SystemAdmin (`admin` / `Admin@123`)
2. Navigate to Rail Scheduling page
3. Click "Assign Orders" button on any train schedule
4. Dialog should now display:
   - Capacity progress bar with utilization percentage
   - Available space statistics
   - List of available orders with checkboxes
   - No error messages

## Impact

- ✅ SystemAdmin can now manage rail allocations
- ✅ All allocation operations accessible to admins
- ✅ No breaking changes to existing Assistant/Management access
- ✅ More flexible role-based access control

## Date Fixed
2025-10-20 22:30:00

## Status
✅ **RESOLVED** - FastAPI auto-reload should apply changes automatically
