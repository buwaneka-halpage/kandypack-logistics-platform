# Frontend-Backend Connection Guide

**Date:** October 19, 2025  
**Status:** ✅ Connected and Operational

---

## 📋 Overview

This document explains how the KandyPack Logistics Platform frontend (React Router v7) connects to the FastAPI backend, including configuration, authentication flow, and testing procedures.

## 🔗 Connection Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Architecture Overview                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐                    ┌──────────────┐       │
│  │   Frontend   │                    │   Backend    │       │
│  │  (React)     │  ← HTTP/JSON →    │   (FastAPI)  │       │
│  │  Port: 5173  │                    │  Port: 8000  │       │
│  └──────────────┘                    └──────────────┘       │
│       │                                      │               │
│       │                                      │               │
│       ▼                                      ▼               │
│  localStorage                         MySQL Database        │
│  (JWT Token)                         (kandypack_db)         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Backend server running on port 8000
- MySQL database populated with sample data
- Node.js installed for frontend

### Start Both Servers

**Terminal 1: Backend**
```powershell
$env:MYSQL_PASSWORD="25747#Xman"
cd Backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2: Frontend**
```powershell
cd frontend/UI
npm run dev
```

### Access Points
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

---

## ⚙️ Configuration Details

### 1. Backend CORS Configuration

**File:** `Backend/app/main.py`

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative frontend port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],  # Including Authorization
)
```

**What This Enables:**
- ✅ Frontend can make requests to backend API
- ✅ JWT tokens sent in Authorization headers
- ✅ Cookies and credentials included in requests
- ✅ All HTTP methods allowed (GET, POST, PUT, DELETE, PATCH)
- ✅ Custom headers including `Authorization: Bearer <token>`

### 2. Frontend API Configuration

**File:** `frontend/UI/.env`

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME="KandyPack Logistics"
VITE_APP_VERSION="1.0.0"
VITE_ENABLE_MAP=true
VITE_ENABLE_REPORTS=true
```

**File:** `frontend/UI/app/services/api.ts`

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
```

**Important Notes:**
- Environment variables must start with `VITE_` to be accessible in the frontend
- The API client automatically adds JWT token to all requests
- Tokens are stored in `localStorage`

---

## 🔐 Authentication Flow

### 1. Staff/User Login

**Frontend Request:**
```typescript
import { AuthAPI } from 'app/services/api';

const response = await AuthAPI.loginStaff('admin', 'admin123');
```

**Backend Endpoint:** `POST /users/login`

**Request Format:** `application/x-www-form-urlencoded`
```
username=admin
password=admin123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user_id": "uuid-here",
  "username": "admin",
  "role": "Management"
}
```

### 2. Customer Login

**Frontend Request:**
```typescript
const response = await AuthAPI.loginCustomer('customer1', 'customer123');
```

**Backend Endpoint:** `POST /customers/login`

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "customer_id": "uuid-here",
  "customer_user_name": "customer1",
  "role": "Customer"
}
```

### 3. Authenticated Requests

Once logged in, all API requests automatically include the token:

```typescript
// Frontend automatically adds this header:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

// Example request:
const orders = await OrdersAPI.getAll();
```

**Backend validates the token** on protected routes using dependency injection:

```python
from app.core.auth import get_current_user

@router.get("/")
async def get_orders(current_user: dict = Depends(get_current_user)):
    # current_user contains: {"sub": "user_id", "role": "Management"}
    ...
```

---

## 📡 API Endpoints Mapping

### Authentication
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `AuthAPI.loginStaff()` | `/users/login` | POST | ❌ |
| `AuthAPI.loginCustomer()` | `/customers/login` | POST | ❌ |

### Orders
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `OrdersAPI.getAll()` | `/orders` | GET | ✅ |
| `OrdersAPI.getById(id)` | `/orders/{order_id}` | GET | ✅ |
| `OrdersAPI.create(data)` | `/orders` | POST | ✅ |
| `OrdersAPI.update(id, data)` | `/orders/{order_id}` | PUT | ✅ |
| `OrdersAPI.delete(id)` | `/orders/{order_id}` | DELETE | ✅ |
| `OrdersAPI.assignToWarehouse()` | `/orders/{order_id}/assign-warehouse` | POST | ✅ Management |

### Customers
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `CustomersAPI.getAll()` | `/customers` | GET | ✅ Management |
| `CustomersAPI.getById(id)` | `/customers/{customer_id}` | GET | ✅ |
| `CustomersAPI.create(data)` | `/customers` | POST | ✅ |
| `CustomersAPI.update(id, data)` | `/customers/{customer_id}` | PUT | ✅ |
| `CustomersAPI.delete(id)` | `/customers/{customer_id}` | DELETE | ✅ |

### Cities, Stations, Stores
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `CitiesAPI.getAll()` | `/cities` | GET | ✅ |
| `RailwayStationsAPI.getAll()` | `/railway-stations` | GET | ✅ |
| `StoresAPI.getAll()` | `/stores` | GET | ✅ |

### Products
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `ProductsAPI.getAll()` | `/products` | GET | ✅ |
| `ProductsAPI.create(data)` | `/products` | POST | ✅ |

### Routes & Scheduling
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `RoutesAPI.getAll()` | `/routes` | GET | ✅ |
| `TrainSchedulesAPI.getAll()` | `/train-schedules` | GET | ✅ |
| `TruckSchedulesAPI.getAll()` | `/truck-schedules` | GET | ✅ |

### Drivers & Assistants
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `DriversAPI.getAll()` | `/drivers` | GET | ✅ |
| `AssistantsAPI.getAll()` | `/assistants` | GET | ✅ |

### Reports (Management Only)
| Frontend Method | Backend Endpoint | Method | Auth Required |
|----------------|------------------|---------|---------------|
| `ReportsAPI.quarterlySales()` | `/reports/sales/quarterly` | GET | ✅ Management |
| `ReportsAPI.salesByCity()` | `/reports/sales/by-city` | GET | ✅ Management |
| `ReportsAPI.driverHours()` | `/reports/work-hours/drivers` | GET | ✅ Management |
| `ReportsAPI.truckUsage()` | `/reports/truck-usage` | GET | ✅ Management |

---

## 🧪 Testing the Connection

### 1. Test Backend is Running

```powershell
# Test root endpoint
curl http://localhost:8000/

# Expected response:
# {"message": "Kandypack Supply Chain API"}
```

### 2. Test Login from Frontend

Open browser console on http://localhost:5173 and run:

```javascript
// Test staff login
const response = await fetch('http://localhost:8000/users/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'username=admin&password=admin123'
});
const data = await response.json();
console.log(data);
```

**Expected Response:**
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user_id": "...",
  "username": "admin",
  "role": "Management"
}
```

### 3. Test Authenticated Request

```javascript
// Store token from login response
const token = data.access_token;

// Test fetching orders
const ordersResponse = await fetch('http://localhost:8000/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const orders = await ordersResponse.json();
console.log(orders);
```

### 4. Test from Frontend UI

1. Navigate to http://localhost:5173
2. Click "Login" or navigate to login page
3. Enter credentials:
   - Username: `admin`
   - Password: `admin123`
4. Upon successful login, you should:
   - See your dashboard
   - Be able to view orders
   - Access all features based on your role

---

## 🔧 Token Management

### Storage
Tokens are stored in `localStorage`:

```typescript
// Set token
localStorage.setItem('kandypack_token', token);

// Get token
const token = localStorage.getItem('kandypack_token');

// Remove token (logout)
localStorage.removeItem('kandypack_token');
```

### Token Service

**File:** `frontend/UI/app/services/api.ts`

```typescript
export const TokenService = {
  getToken(): string | null {
    return localStorage.getItem('kandypack_token');
  },

  setToken(token: string): void {
    localStorage.setItem('kandypack_token', token);
  },

  removeToken(): void {
    localStorage.removeItem('kandypack_token');
  },

  getUser(): any {
    const userStr = localStorage.getItem('kandypack_user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser(user: any): void {
    localStorage.setItem('kandypack_user', JSON.stringify(user));
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
};
```

### Auto-Injection in Requests

The `HttpClient` class automatically adds the token to all requests:

```typescript
private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = TokenService.getToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const response = await fetch(`${this.baseURL}${endpoint}`, config);
  // ...
}
```

---

## 🛡️ Role-Based Access Control

### Frontend Implementation

**File:** `frontend/UI/app/hooks/useAuth.tsx`

```typescript
export function useAuth() {
  const user = TokenService.getUser();
  
  return {
    user,
    role: user?.role,
    isAuthenticated: !!user,
    isManagement: user?.role === 'Management',
    isSystemAdmin: user?.role === 'SystemAdmin',
    isStoreManager: user?.role === 'StoreManager',
    isWarehouseStaff: user?.role === 'WarehouseStaff',
    isCustomer: user?.role === 'Customer',
  };
}
```

### Backend Implementation

**File:** `Backend/app/core/auth.py`

```python
def require_management(current_user: dict = Security(get_current_user)) -> dict:
    """Require Management role"""
    if current_user.get("role") != "Management":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Management access required"
        )
    return current_user
```

### Role Permissions

| Role | Can View | Can Create | Can Update | Can Delete | Special Access |
|------|----------|------------|------------|------------|----------------|
| **Management** | All data | ✅ All | ✅ All | ✅ All | Assign orders, Reports |
| **SystemAdmin** | All data | ✅ System config | ✅ System config | ✅ System config | System management |
| **StoreManager** | Warehouse-specific | ✅ Limited | ✅ Warehouse data | ❌ | Warehouse operations |
| **WarehouseStaff** | Warehouse-specific | ❌ | ✅ Limited | ❌ | Daily operations |
| **DriverAssistant** | Own schedules | ❌ | ✅ Status updates | ❌ | Route updates |
| **Customer** | Own orders | ✅ Own orders | ✅ Own orders | ❌ | Order tracking |

---

## 🐛 Troubleshooting

### Issue 1: CORS Errors

**Error:**
```
Access to fetch at 'http://localhost:8000/orders' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
1. Verify backend CORS middleware is configured in `app/main.py`
2. Check that frontend origin (localhost:5173) is in `allow_origins`
3. Restart backend server after changes

### Issue 2: 401 Unauthorized on All Requests

**Error:**
```
{"detail": "Not authenticated"}
```

**Solution:**
1. Check if token is stored: `localStorage.getItem('kandypack_token')`
2. Verify token format: Should be JWT string
3. Check if token is expired (JWT tokens expire after configured time)
4. Try logging in again

### Issue 3: Backend Not Connecting

**Error:**
```
TypeError: Failed to fetch
```

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/`
2. Check VITE_API_BASE_URL in `.env` file
3. Ensure no firewall blocking port 8000
4. Try using 127.0.0.1 instead of localhost

### Issue 4: Environment Variables Not Loading

**Error:**
```
undefined when accessing import.meta.env.VITE_API_BASE_URL
```

**Solution:**
1. Ensure `.env` file is in `frontend/UI/` directory
2. Variable names must start with `VITE_`
3. Restart Vite dev server after `.env` changes
4. Check `.env` file is not in `.gitignore`

### Issue 5: Token Not Persisting

**Problem:** Token lost on page refresh

**Solution:**
1. Check browser localStorage is enabled
2. Verify `TokenService.setToken()` is called after login
3. Check for browser extensions blocking localStorage
4. Ensure private/incognito mode isn't clearing storage

---

## 📊 Network Traffic Debugging

### Browser DevTools

1. **Open DevTools:** F12 or Right-click → Inspect
2. **Network Tab:** View all API requests
3. **Filter by XHR/Fetch:** See only API calls
4. **Check Request Headers:** Verify Authorization header is sent
5. **Check Response:** View status code and response data

### Useful Filters

```
Method:POST         # Show only POST requests
Status:401         # Show unauthorized requests
domain:localhost   # Show only local API calls
```

### Example Request Inspection

**Request Headers:**
```
GET /orders HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
Origin: http://localhost:5173
```

**Response Headers:**
```
HTTP/1.1 200 OK
Content-Type: application/json
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Credentials: true
```

---

## 🔄 Development Workflow

### Making API Changes

**Backend Changes:**
1. Update endpoint in `Backend/app/api/*.py`
2. Server auto-reloads with `--reload` flag
3. Test in Swagger UI: http://localhost:8000/docs
4. Update frontend API service if needed

**Frontend Changes:**
1. Update `frontend/UI/app/services/api.ts`
2. Vite auto-reloads on save
3. Test in browser
4. Check Network tab for request/response

### Adding New Endpoints

**Step 1: Backend**
```python
# In Backend/app/api/new_resource.py
@router.get("/new-endpoint")
async def new_endpoint(current_user: dict = Depends(get_current_user)):
    return {"data": "example"}
```

**Step 2: Frontend**
```typescript
// In frontend/UI/app/services/api.ts
export const NewResourceAPI = {
  async getNewData() {
    return httpClient.get<any>('/new-endpoint');
  },
};
```

**Step 3: Use in Component**
```typescript
import { NewResourceAPI } from 'app/services/api';

const data = await NewResourceAPI.getNewData();
```

---

## 📝 Best Practices

### Security
- ✅ Always use HTTPS in production
- ✅ Keep JWT tokens short-lived (15-60 minutes)
- ✅ Implement refresh tokens for longer sessions
- ✅ Never log tokens or sensitive data
- ✅ Validate and sanitize all inputs
- ✅ Use environment variables for secrets

### Performance
- ✅ Cache frequently accessed data
- ✅ Implement pagination for large datasets
- ✅ Use loading states in UI
- ✅ Debounce search inputs
- ✅ Minimize API calls
- ✅ Use React Query or SWR for data fetching

### Error Handling
- ✅ Show user-friendly error messages
- ✅ Log errors to console/service
- ✅ Handle network failures gracefully
- ✅ Implement retry logic for failed requests
- ✅ Display validation errors clearly
- ✅ Provide fallback UI

### Code Organization
- ✅ Keep API calls in service layer
- ✅ Separate business logic from UI
- ✅ Use TypeScript for type safety
- ✅ Document complex endpoints
- ✅ Use consistent naming conventions
- ✅ Write reusable components

---

## 🚀 Production Deployment

### Environment Variables

**Backend:**
```env
# .env
MYSQL_HOST=production-db.example.com
MYSQL_DATABASE=kandypack_prod
MYSQL_USER=prod_user
MYSQL_PASSWORD=secure_password
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://kandypack.example.com
```

**Frontend:**
```env
# .env.production
VITE_API_BASE_URL=https://api.kandypack.example.com
VITE_APP_NAME="KandyPack Logistics"
```

### CORS for Production

```python
# Update allowed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://kandypack.example.com",
        "https://www.kandypack.example.com",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

---

## 📚 Additional Resources

### Documentation
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Router v7 Docs](https://reactrouter.com/)
- [JWT.io](https://jwt.io/) - Token inspector
- [CORS Explained](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

### Tools
- **Postman:** API testing
- **Insomnia:** API client
- **curl:** Command-line HTTP client
- **jq:** JSON processor for command line

### Testing Commands

```powershell
# Test login
curl -X POST http://localhost:8000/users/login `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=admin&password=admin123"

# Test authenticated endpoint
curl http://localhost:8000/orders `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test CORS preflight
curl -X OPTIONS http://localhost:8000/orders `
  -H "Origin: http://localhost:5173" `
  -H "Access-Control-Request-Method: GET" `
  -v
```

---

## ✅ Connection Checklist

- [x] Backend running on port 8000
- [x] Frontend running on port 5173
- [x] CORS middleware configured
- [x] .env file created with API_BASE_URL
- [x] JWT authentication implemented
- [x] Token storage in localStorage
- [x] API service layer created
- [x] Error handling implemented
- [x] Role-based access control working
- [x] Test credentials documented
- [x] Network requests can be inspected
- [x] Documentation complete

---

**Document Version:** 1.0  
**Last Updated:** October 19, 2025  
**Status:** Complete and Verified ✅

---

*This connection guide documents the complete integration between the KandyPack Logistics Platform frontend and backend. All endpoints have been tested and verified as working.*
