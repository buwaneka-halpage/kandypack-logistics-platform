# SystemAdmin Role Privileges

## Overview
The **SystemAdmin** role has been configured to have full administrative access to the KandyPack Logistics Platform. SystemAdmin users can perform all operations that Management users can, plus additional system-level tasks.

## Current Implementation Status

### ✅ Implemented Privileges

#### 1. User Management (Full Access)
- **Create Users**: Can create users with any role (including other SystemAdmins and Management users)
  - Endpoint: `POST /users/`
  - Modified in: `app/core/auth.py` - `require_management()` function
  - Allows: SystemAdmin, Management

#### 2. Authentication & Authorization
- **Login**: SystemAdmin can authenticate via `/users/login`
- **Token Generation**: Receives JWT tokens with `role: "SystemAdmin"`
- **Password Hashing**: Can use `/users/strtopass` to generate password hashes

### ⚠️ Needs Update for Full SystemAdmin Access

The following API endpoints currently check for specific roles but should also allow SystemAdmin. You have two options:

#### Option A: Use Helper Functions (Recommended)
Update role checks to use the new helper functions from `auth.py`:
- `is_admin_or_management(role)` - Returns True for SystemAdmin or Management
- `check_role_permission(role, allowed_list)` - Returns True if SystemAdmin OR role in list

#### Option B: Add SystemAdmin to Each Check
Manually add `"SystemAdmin"` to every role check list.

### Files That Need SystemAdmin Access:

#### Critical Operations (Management-only)
1. **Reports** (`app/api/reports.py`) - All 8 report endpoints
   - Current: `if role not in ["Management"]:`
   - Should be: `if not check_role_permission(role, ["Management"]):`

2. **Orders Management** (`app/api/orders.py`)
   - Update order status: Line 115, 147, 163
   - Assign warehouse: Line 163
   - Current: `if role not in ["Management"]:`
   - Should include SystemAdmin

3. **Products** (`app/api/products.py`)
   - Create/Delete products: Lines 12, 130, 193
   - Current: `if role != "Management":`
   - Should include SystemAdmin

4. **Train Schedules** (`app/api/train_schedules.py`)
   - Schedule management: Line 99
   - Current: `if role != "Management":`
   - Should include SystemAdmin

#### Shared Operations (Multiple Roles + Should Include SystemAdmin)
5. **Stores** (`app/api/stores.py`) - Lines 16, 32, 50, 77, 108
   - Current: `if role not in ["WarehouseStaff", "Management"]:`
   - Should be: `if not check_role_permission(role, ["WarehouseStaff", "Management"]):`

6. **Trucks** (`app/api/trucks.py`) - Lines 19, 36, 56, 98
   - Current: `if role not in ["Assistant", "Management"]:`
   - Should include SystemAdmin

7. **Routes** (`app/api/routes.py`) - Lines 18, 34, 47, 73, 95
   - Current: `if role not in ["Assistant", "Management"]:`
   - Should include SystemAdmin

8. **Trains** (`app/api/trains.py`) - Lines 20, 32
   - Current: `if role not in ["WarehouseStaff", "Management"]:`
   - Should include SystemAdmin

9. **Drivers & Assistants** (`app/api/drivers.py`, `app/api/assistants.py`)
   - Current: `if role not in ["Assistant", "Management"]:`
   - Should include SystemAdmin

10. **Railway Stations** (`app/api/railway_stations.py`)
    - Current: `if role not in ["Management", "Assistant"]:`
    - Should include SystemAdmin

## Quick Fix Script

To quickly add SystemAdmin access everywhere, you can run this search and replace:

```bash
# Option 1: Add SystemAdmin to Management-only checks
Find: if role not in \["Management"\]:
Replace: if role not in ["Management", "SystemAdmin"]:

Find: if role != "Management":
Replace: if role not in ["Management", "SystemAdmin"]:

# Option 2: Add SystemAdmin to shared role checks
Find: if role not in \[
Replace: if not check_role_permission(role, [

# Don't forget to remove the closing colon and add it after the list
```

## Testing SystemAdmin Access

### Test Credentials
```
Username: admin
Password: password123
Role: SystemAdmin
```

OR

```
Username: sysadmin  
Password: password123
Role: SystemAdmin
```

### Test Cases

1. **Login as SystemAdmin**
```bash
curl -X POST "http://localhost:8000/users/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=password123"
```

2. **Create a New User** (Should work for SystemAdmin)
```bash
curl -X POST "http://localhost:8000/users/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"user_name": "newuser", "password": "test123", "role": "StoreManager"}'
```

3. **Access Reports** (Should work for SystemAdmin)
```bash
curl -X GET "http://localhost:8000/reports/quarterly-sales" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Recommended Action Plan

### Phase 1: Critical Updates (Do First)
1. ✅ Update `require_management()` in `auth.py` - **DONE**
2. ✅ Add helper functions - **DONE**
3. Update `reports.py` - Add SystemAdmin to all checks
4. Update `orders.py` - Add SystemAdmin to management checks
5. Update `products.py` - Add SystemAdmin to management checks

### Phase 2: General Updates
6. Update remaining API files using helper function or direct role list updates
7. Test all endpoints with SystemAdmin credentials
8. Update API documentation

### Phase 3: Documentation
9. Update API docs to show SystemAdmin has full access
10. Add role permission matrix to README

## Summary

**Current Status**: 
- ✅ SystemAdmin can login
- ✅ SystemAdmin can create users
- ⚠️ SystemAdmin needs to be added to ~50+ role checks for full access

**Recommendation**: Use the `check_role_permission()` helper function to automatically grant SystemAdmin access to all endpoints without modifying every file individually.

## Example Implementation

### Before (Current):
```python
@router.get("/")
async def get_all_orders(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management"]:
        raise HTTPException(status_code=403, detail="Access denied")
    # ... rest of code
```

### After (Option 1 - Using Helper):
```python
from app.core.auth import check_role_permission

@router.get("/")
async def get_all_orders(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if not check_role_permission(role, ["StoreManager", "Management"]):
        raise HTTPException(status_code=403, detail="Access denied")
    # ... rest of code
```

### After (Option 2 - Direct Update):
```python
@router.get("/")
async def get_all_orders(db: db_dependency, current_user: dict = Depends(get_current_user)):
    role = current_user.get("role")
    if role not in ["StoreManager", "Management", "SystemAdmin"]:
        raise HTTPException(status_code=403, detail="Access denied")
    # ... rest of code
```

**Option 1 is recommended** as it automatically grants SystemAdmin access everywhere without touching 50+ files.
