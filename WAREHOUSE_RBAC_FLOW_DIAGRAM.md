# Warehouse-Scoped Access Control - Visual Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        KandyPack Logistics Platform                          │
│                     Warehouse-Based Access Control System                     │
└─────────────────────────────────────────────────────────────────────────────┘

                                USER ROLES & SCOPES
┌──────────────────────┬──────────────────────┬──────────────────────────────┐
│   SCOPE: ALL         │   SCOPE: WAREHOUSE   │      SCOPE: OWN              │
│  (All Warehouses)    │  (Single Warehouse)  │   (Personal Only)            │
├──────────────────────┼──────────────────────┼──────────────────────────────┤
│  • Management        │  • Store Manager     │   • Customer                 │
│  • System Admin      │  • Warehouse Staff   │   • Driver                   │
│                      │  • Driver Assistant  │                              │
└──────────────────────┴──────────────────────┴──────────────────────────────┘


## Order Assignment Flow

┌─────────────┐
│  Customer   │
│   Places    │
│   Order     │
└──────┬──────┘
       │
       │ Creates Order (warehouse_id = NULL)
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UNASSIGNED ORDERS POOL                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ ORDER-1 │  │ ORDER-2 │  │ ORDER-3 │  │ ORDER-4 │  │ ORDER-5 │         │
│  │  NULL   │  │  NULL   │  │  NULL   │  │  NULL   │  │  NULL   │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                                              │
│  ⚠️  Only visible to Management & System Admin                              │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       │ Management assigns order to warehouse
       │ POST /orders/{id}/assign-warehouse
       │
       ▼
┌───────────────────────────────────────────────────────────────────────────────┐
│                          WAREHOUSE ASSIGNMENT                                  │
│                                                                                │
│   IF: destination_city = "Colombo"  →  Assign to: WAREHOUSE-COLOMBO          │
│   IF: destination_city = "Kandy"    →  Assign to: WAREHOUSE-KANDY            │
│   IF: destination_city = "Galle"    →  Assign to: WAREHOUSE-GALLE            │
│                                                                                │
└───────────────────────────────────────────────────────────────────────────────┘
       │
       │ Order.warehouse_id = 'WH-COLOMBO'
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          WAREHOUSE ISOLATION                                 │
│                                                                              │
│  ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐   │
│  │  WH-COLOMBO        │  │  WH-KANDY          │  │  WH-GALLE          │   │
│  │  ═══════════       │  │  ═══════════       │  │  ═══════════       │   │
│  │  ┌───────────┐     │  │  ┌───────────┐     │  │  ┌───────────┐     │   │
│  │  │ ORDER-1   │     │  │  │ ORDER-2   │     │  │  │ ORDER-3   │     │   │
│  │  │ WH-COL    │     │  │  │ WH-KND    │     │  │  │ WH-GLE    │     │   │
│  │  └───────────┘     │  │  └───────────┘     │  │  └───────────┘     │   │
│  │                    │  │                    │  │                    │   │
│  │  Staff:            │  │  Staff:            │  │  Staff:            │   │
│  │  • Store Mgr A     │  │  • Store Mgr B     │  │  • Store Mgr C     │   │
│  │  • WH Staff 1,2    │  │  • WH Staff 3,4    │  │  • WH Staff 5,6    │   │
│  │  • Driver Asst A   │  │  • Driver Asst B   │  │  • Driver Asst C   │   │
│  └────────────────────┘  └────────────────────┘  └────────────────────┘   │
│         │                        │                        │                │
│         │                        │                        │                │
│   Can ONLY see              Can ONLY see            Can ONLY see          │
│   WH-COLOMBO data           WH-KANDY data           WH-GALLE data         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


## Permission Check Flow

┌─────────────────┐
│  User Action    │
│  (Update Order) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  Frontend: hasUserPermissionWithScope('order', 'update', 'WH-001')  │
└────────┬────────────────────────────────────────────────────────────┘
         │
         ▼
    ┌────────┐
    │ Check  │
    │  Role  │
    └───┬────┘
        │
        ├─── Management/SystemAdmin? ──→ [ALLOW] scope = 'all'
        │
        ├─── Store Manager? 
        │    └─→ user.warehouseId === order.warehouseId?
        │        ├─→ YES: [ALLOW] scope = 'warehouse'
        │        └─→ NO:  [DENY]  Cross-warehouse access
        │
        ├─── Warehouse Staff?
        │    └─→ user.warehouseId === order.warehouseId?
        │        ├─→ YES: [ALLOW] scope = 'warehouse'
        │        └─→ NO:  [DENY]  Cross-warehouse access
        │
        └─── Customer?
             └─→ user.id === order.customerId?
                 ├─→ YES: [ALLOW] scope = 'own'
                 └─→ NO:  [DENY]  Not your order


## Backend API Flow

┌────────────────────┐
│  API Request       │
│  GET /orders       │
│  Authorization:    │
│  Bearer <JWT>      │
└─────────┬──────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend: Verify JWT Token                                  │
│  • Extract: user_id, role, warehouse_id                     │
└─────────┬───────────────────────────────────────────────────┘
          │
          ▼
     ┌────────┐
     │ Filter │
     │  Data  │
     └───┬────┘
         │
         ├─── role = 'Management' ──────→ Return ALL orders
         │                                 (No filter)
         │
         ├─── role = 'SystemAdmin' ─────→ Return ALL orders
         │                                 (No filter)
         │
         ├─── role = 'StoreManager' ────→ WHERE warehouse_id = user.warehouse_id
         │
         ├─── role = 'WarehouseStaff' ──→ WHERE warehouse_id = user.warehouse_id
         │
         ├─── role = 'DriverAssistant' ─→ WHERE warehouse_id = user.warehouse_id
         │
         └─── role = 'Customer' ────────→ WHERE customer_id = user.id
         

## Data Isolation Example

### Scenario: Store Manager from Warehouse A tries to access Order from Warehouse B

┌─────────────────────────────────────────────────────────────────────┐
│  1. User Login                                                       │
│     • Email: manager.a@kandypack.com                                │
│     • Role: StoreManager                                            │
│     • warehouse_id: 'WH-A'                                          │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  2. Frontend: Load Orders                                           │
│     OrdersAPI.getByWarehouse('WH-A')                                │
│     → Returns: [ORDER-101, ORDER-102, ORDER-103]                    │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  3. User attempts to access ORDER-205 (from WH-B)                   │
│     • Direct API call: PUT /orders/ORDER-205                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  4. Backend Validation                                              │
│     • Check: order.warehouse_id = 'WH-B'                            │
│     • Check: user.warehouse_id = 'WH-A'                             │
│     • Result: 'WH-A' ≠ 'WH-B'                                       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│  5. Response: 403 Forbidden                                         │
│     {                                                                │
│       "error": "Access denied to this warehouse"                    │
│     }                                                                │
│                                                                      │
│  6. Audit Log Created                                               │
│     • User: manager.a@kandypack.com                                 │
│     • Action: UNAUTHORIZED_ACCESS_ATTEMPT                           │
│     • Resource: ORDER-205 (WH-B)                                    │
│     • Timestamp: 2025-10-19 14:32:15                                │
└─────────────────────────────────────────────────────────────────────┘


## JWT Token Structure

┌─────────────────────────────────────────────────────────────────┐
│  JWT Token Payload                                              │
│  {                                                               │
│    "sub": "U-12345",              // User ID                    │
│    "role": "StoreManager",        // User Role                  │
│    "warehouse_id": "WH-COLOMBO",  // Assigned Warehouse         │
│    "exp": 1729353135              // Expiration (100 minutes)   │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘


## Component Access Matrix

┌──────────────────┬──────────┬──────────┬──────────┬──────────┐
│                  │  Orders  │ Assign   │ Warehouse│ Customer │
│  Role / Action   │  View    │ Warehouse│ Inventory│  Orders  │
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│  Management      │  ALL     │   YES    │   ALL    │   ALL    │
│  SystemAdmin     │  ALL     │   YES    │   ALL    │   ALL    │
│  StoreManager    │  WH-ONLY │   NO     │  WH-ONLY │   ALL    │
│  WarehouseStaff  │  WH-ONLY │   NO     │  WH-ONLY │   NO     │
│  DriverAssistant │  WH-ONLY │   NO     │   NO     │   NO     │
│  Driver          │  OWN     │   NO     │   NO     │   NO     │
│  Customer        │  OWN     │   NO     │   NO     │   OWN    │
└──────────────────┴──────────┴──────────┴──────────┴──────────┘

Legend:
  ALL     = Can access all warehouses
  WH-ONLY = Can only access assigned warehouse
  OWN     = Can only access own resources
  YES/NO  = Can/Cannot perform action


## Security Layers

┌─────────────────────────────────────────────────────────────────────┐
│                     Multi-Layer Security                             │
│                                                                      │
│  Layer 1: Frontend Permission Check                                 │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  hasUserPermissionWithScope()                              │    │
│  │  • Hides UI elements user can't access                     │    │
│  │  • Prevents unnecessary API calls                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                          ↓                                           │
│  Layer 2: API Client Validation                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • JWT token included in headers                           │    │
│  │  • Request parameters validated                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                          ↓                                           │
│  Layer 3: Backend Authorization                                     │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • JWT token verified                                       │    │
│  │  • User role extracted                                      │    │
│  │  • Warehouse ID validated                                   │    │
│  │  • SQL query filtered by warehouse                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                          ↓                                           │
│  Layer 4: Database Constraints                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • Foreign key constraints                                  │    │
│  │  • Row-level security policies                             │    │
│  │  • Indexes for performance                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                          ↓                                           │
│  Layer 5: Audit Logging                                             │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  • All access attempts logged                              │    │
│  │  • Failed authorization attempts flagged                   │    │
│  │  • Regular security audits                                 │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘


## Implementation Checklist

Frontend:
  [✓] Type definitions (roles.ts)
  [✓] User interface with warehouse fields
  [✓] Permission checking functions
  [✓] API client methods
  [✓] Example components
  [✓] Documentation

Backend (Required):
  [ ] Database schema updates
  [ ] Login endpoint with warehouse data
  [ ] Warehouse filtering in endpoints
  [ ] Order assignment endpoint
  [ ] Warehouse-specific endpoints
  [ ] Authorization middleware
  [ ] Audit logging

Testing:
  [ ] Management can assign orders
  [ ] Warehouse staff isolation
  [ ] Cross-warehouse prevention
  [ ] API authorization checks
  [ ] Frontend permission checks
  [ ] Audit log verification


## Key Takeaways

1. **Data Isolation**: Each warehouse is completely isolated from others
2. **Role-Based**: Different roles have different scopes of access
3. **Multi-Layer**: Security enforced at multiple levels
4. **Auditable**: All actions logged for compliance
5. **Scalable**: Supports multiple warehouses nationwide
6. **Type-Safe**: Full TypeScript support throughout
```
