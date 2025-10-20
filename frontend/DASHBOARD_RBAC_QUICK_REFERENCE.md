# Dashboard RBAC Quick Reference

## Permission Check Examples

### Check if user can view orders
```typescript
import { useAuth } from '~/hooks/useAuth';
import { hasPermission, UserRole } from '~/types/roles';

const { user } = useAuth();
const canView = hasPermission(user.role as UserRole, 'order', 'read');
```

### Check if user can create/update/delete
```typescript
const canCreate = hasPermission(user.role, 'order', 'create');
const canUpdate = hasPermission(user.role, 'order', 'update');
const canDelete = hasPermission(user.role, 'order', 'delete');
```

### Check wildcard permissions (SystemAdmin)
```typescript
const canDoAnything = hasPermission(user.role, '*', '*');
```

---

## API Call Patterns

### Basic API Call
```typescript
import { OrdersAPI } from '~/services/api';

const orders = await OrdersAPI.getAll();
```

### With Warehouse Filtering
```typescript
const filters: any = {};

if (user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN) {
  filters.warehouse_id = user.warehouseId;
}

const orders = await OrdersAPI.getAll(filters);
```

### With Error Handling
```typescript
try {
  const data = await OrdersAPI.getAll(filters);
  setData(data);
} catch (error: any) {
  console.error('Error:', error);
  setError(error.message || 'Failed to load data');
}
```

---

## Common Permission Resources

| Resource | Actions | Roles with Access |
|----------|---------|-------------------|
| `order` | read, create, update, delete | Management, SystemAdmin, StoreManager (warehouse), Customer (own) |
| `user` | read, create, update, delete | Management, SystemAdmin |
| `warehouse` | read, update, assign | SystemAdmin, Management, StoreManager (own) |
| `truck` | read, create, update | SystemAdmin, Management, StoreManager, DriverAssistant |
| `driver` | read, update, assign | SystemAdmin, Management, StoreManager, DriverAssistant |
| `reports` | execute, read | SystemAdmin, Management |
| `*` (all) | * (all) | SystemAdmin only |

---

## Permission Scopes

### All Scope
- **Who**: SystemAdmin, Management
- **Access**: All data across all warehouses
- **Filter**: None

```typescript
// No filtering needed
const data = await API.getAll();
```

### Warehouse Scope
- **Who**: StoreManager, WarehouseStaff, DriverAssistant
- **Access**: Only their assigned warehouse data
- **Filter**: `warehouse_id: user.warehouseId`

```typescript
const filters = { warehouse_id: user.warehouseId };
const data = await API.getAll(filters);
```

### Own Scope
- **Who**: Customer, Driver
- **Access**: Only their own resources
- **Filter**: `user_id: user.id` or `driver_id: user.driverId`

```typescript
const filters = { user_id: user.id };
const data = await API.getAll(filters);
```

---

## Component Access Matrix

| Component | SystemAdmin | Management | StoreManager | WarehouseStaff | Driver | DriverAssistant |
|-----------|------------|------------|--------------|----------------|--------|-----------------|
| AdminOverview | ✅ All | ✅ All | ✅ Warehouse | ❌ | ❌ | ✅ Warehouse |
| WeeklyOrderChart | ✅ All | ✅ All | ✅ Warehouse | ✅ Warehouse | ✅ Own | ✅ Warehouse |
| DeliveryProgress | ✅ All | ✅ All | ✅ Warehouse | ✅ Warehouse | ✅ Own | ✅ Warehouse |
| LogisticsMap | ✅ All | ✅ All | ✅ Warehouse | ✅ Warehouse | ✅ Own Truck | ✅ Warehouse |

---

## Common Code Snippets

### Dashboard Widget Template with RBAC
```typescript
import React, { useState, useEffect } from 'react';
import { useAuth } from '~/hooks/useAuth';
import { hasPermission, UserRole } from '~/types/roles';
import { SomeAPI } from '~/services/api';
import { AlertCircle } from 'lucide-react';

const MyWidget: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check permissions
  const canView = user && hasPermission(user.role as UserRole, 'resource', 'read');

  useEffect(() => {
    if (!canView) {
      setError('You do not have permission to view this data');
      setLoading(false);
      return;
    }

    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const filters: any = {};

      // Add warehouse filter if needed
      if (user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT) {
        filters.warehouse_id = user.warehouseId;
      }

      const result = await SomeAPI.getAll(filters);
      setData(result || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div><AlertCircle /> {error}</div>;
  if (!canView) return <div>No Permission</div>;

  return (
    <div>
      {/* Your component content */}
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};

export default MyWidget;
```

### Conditional Rendering Based on Permissions
```typescript
{hasPermission(user.role, 'order', 'create') && (
  <button onClick={handleCreate}>Create Order</button>
)}

{hasPermission(user.role, 'reports', 'execute') && (
  <button onClick={handleDownload}>Download Report</button>
)}
```

### Show Warehouse Badge
```typescript
{user?.warehouseId && user.role !== UserRole.SYSTEM_ADMIN && user.role !== UserRole.MANAGEMENT && (
  <span className="text-dashboard-accent">
    (Warehouse-scoped)
  </span>
)}
```

### Check Warehouse Assignment
```typescript
{!user?.warehouseId && (
  <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
    <AlertCircle className="w-5 h-5 text-yellow-600" />
    <p>You are not assigned to a warehouse. Please contact management.</p>
  </div>
)}
```

---

## Debugging Tips

### Check User Object
```typescript
console.log('User:', user);
console.log('Role:', user?.role);
console.log('Warehouse ID:', user?.warehouseId);
```

### Check Permissions
```typescript
console.log('Can view orders:', hasPermission(user.role, 'order', 'read'));
console.log('Can create orders:', hasPermission(user.role, 'order', 'create'));
```

### Check API Response
```typescript
const data = await SomeAPI.getAll();
console.log('API Response:', data);
console.log('Data length:', data?.length);
```

### Check Filters
```typescript
const filters = { warehouse_id: user.warehouseId };
console.log('Applying filters:', filters);
const data = await SomeAPI.getAll(filters);
```

---

## Testing User Roles

### Login as Different Roles
```typescript
// SystemAdmin
{ username: 'admin', password: 'admin123', role: 'SystemAdmin' }

// Management
{ username: 'manager', password: 'manager123', role: 'Management' }

// StoreManager
{ username: 'store1', password: 'store123', role: 'StoreManager', warehouseId: 'W001' }

// WarehouseStaff
{ username: 'staff1', password: 'staff123', role: 'WarehouseStaff', warehouseId: 'W001' }

// Driver
{ username: 'driver1', password: 'driver123', role: 'Driver', driverId: 'D001' }

// DriverAssistant
{ username: 'assist1', password: 'assist123', role: 'DriverAssistant', warehouseId: 'W001' }
```

### What to Check Per Role
1. Dashboard loads without errors
2. Only allowed widgets are visible
3. Data is properly scoped
4. No permission errors in console
5. Action buttons (create/delete) respect permissions
6. Download/export features work correctly
7. Warehouse assignment warnings show when appropriate

---

## Quick Fixes

### "Cannot find name 'user'" Error
```typescript
// Add import
import { useAuth } from '~/hooks/useAuth';

// Use in component
const { user } = useAuth();
```

### "Cannot find name 'hasPermission'" Error
```typescript
// Add import
import { hasPermission, UserRole } from '~/types/roles';
```

### "Cannot find name 'API'" Error
```typescript
// Add import
import { OrdersAPI, UsersAPI, etc } from '~/services/api';
```

### 401 Unauthorized Error
```typescript
// Check if token exists
import { TokenService } from '~/services/api';
console.log('Token:', TokenService.getToken());

// If no token, redirect to login
if (!TokenService.getToken()) {
  window.location.href = '/login';
}
```

### Empty Data Despite Having Permission
```typescript
// Check filters
console.log('Filters:', filters);

// Try without filters
const data = await API.getAll(); // Remove filters temporarily

// Check backend response
console.log('Raw response:', data);
```

---

## Security Checklist

- [ ] All API calls include JWT token
- [ ] Permissions checked before rendering UI
- [ ] Warehouse-scoped roles have filters applied
- [ ] No hardcoded permissions in components
- [ ] Error messages don't expose sensitive data
- [ ] Failed API calls don't crash the app
- [ ] Permissions match backend implementation
- [ ] No client-side permission bypass possible

---

## Performance Tips

1. **Cache API Responses**: Use React Query or SWR
2. **Debounce Searches**: Avoid API spam
3. **Lazy Load Components**: Use React.lazy()
4. **Pagination**: Don't load all data at once
5. **Memoization**: Use useMemo for expensive calculations
6. **Virtual Scrolling**: For long lists

---

## Need Help?

Refer to:
- `DASHBOARD_API_RBAC_IMPLEMENTATION.md` - Full documentation
- `frontend/UI/app/types/roles.ts` - Role definitions
- `frontend/UI/app/services/api.ts` - API client
- `backend/app/auth.py` - Backend RBAC implementation
