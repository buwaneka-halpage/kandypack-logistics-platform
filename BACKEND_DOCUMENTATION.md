# KandyPack Backend Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Database Architecture](#database-architecture)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Data Models](#data-models)
8. [Stored Procedures & Reports](#stored-procedures--reports)
9. [Setup & Installation](#setup--installation)
10. [API Usage Examples](#api-usage-examples)

---

## 🎯 Overview

The KandyPack Logistics Platform backend is a **RESTful API** built with **FastAPI** that manages a comprehensive supply chain and logistics system. It handles:

- **Multi-modal transportation** (Railway + Road/Truck delivery)
- **Order management** from placement to delivery
- **Resource scheduling** (Trains, Trucks, Drivers, Assistants)
- **Store and warehouse operations**
- **Route optimization** and allocation
- **Real-time reporting** and analytics
- **Role-based access control** (RBAC)

---

## 🛠 Technology Stack

### Core Framework
- **FastAPI** - Modern, fast web framework for building APIs
- **Python 3.x** - Programming language
- **Uvicorn** - ASGI server for running FastAPI

### Database
- **MySQL** - Relational database management system
- **SQLAlchemy** - ORM (Object-Relational Mapping) library
- **PyMySQL** - MySQL database connector

### Authentication & Security
- **python-jose** - JWT (JSON Web Token) implementation
- **passlib** - Password hashing library (pbkdf2_sha256)
- **python-multipart** - Form data parsing for OAuth2

### Additional Libraries
- **Pydantic** - Data validation using Python type annotations
- **pytz** - Timezone handling (Asia/Colombo timezone)
- **uuid** - UUID generation for primary keys
- **cryptography** - Cryptographic operations

---

## 📁 Project Structure

```
Backend/
├── app/
│   ├── __init__.py                 # Package initializer
│   ├── main.py                     # FastAPI application entry point
│   │
│   ├── api/                        # API route handlers
│   │   ├── __init__.py             # API router aggregator
│   │   ├── allocations.py          # Rail & truck allocations endpoints
│   │   ├── assistants.py           # Driver assistants management
│   │   ├── cities.py               # City management
│   │   ├── customers.py            # Customer CRUD + login
│   │   ├── drivers.py              # Driver management
│   │   ├── orders.py               # Order management
│   │   ├── products.py             # Product catalog
│   │   ├── railway_stations.py     # Railway station management
│   │   ├── reports.py              # Analytics & reporting endpoints
│   │   ├── routes.py               # Delivery route management
│   │   ├── stores.py               # Store/warehouse management
│   │   ├── trains.py               # Train fleet management
│   │   ├── train_schedules.py      # Train scheduling
│   │   ├── trucks.py               # Truck fleet management
│   │   ├── truck_schedules.py      # Truck scheduling
│   │   └── users.py                # Staff user management + login
│   │
│   ├── core/                       # Core application logic
│   │   ├── __init__.py
│   │   ├── auth.py                 # JWT authentication & authorization
│   │   ├── config.py               # Configuration (empty - planned)
│   │   ├── database.py             # Database connection & session management
│   │   ├── model.py                # SQLAlchemy ORM models (15 tables)
│   │   └── schemas.py              # Pydantic schemas for validation
│   │
│   └── utils/                      # Utility functions
│       ├── __init__.py
│       └── reports_procs.py        # Stored procedure wrappers
│
├── migrations/                     # Database migrations
│   └── sql/
│       └── procs/                  # Stored procedures (8 reports)
│           ├── AssistantWorkingHourReport.sql
│           ├── citywisesales.sql
│           ├── customerOrderHistory.sql
│           ├── DriverWorkingHourReport.sql
│           ├── mostOrdeditems.sql
│           ├── p_quarterly_sales.sql
│           ├── Routewisesales.sql
│           └── TruckUsagePerMonth.sql
│
├── schemas/                        # Database schema definitions
│   ├── createtables.sql            # Table creation SQL
│   ├── create_indexes.sql          # Index creation SQL
│   └── insert.sql                  # Sample data insertion
│
├── scripts/                        # Utility scripts
│   └── apply_procs.py              # Apply stored procedures to DB
│
├── reqirements.txt                 # Python dependencies
├── .gitignore                      # Git ignore rules
└── README.md                       # Project readme (empty)
```

---

## 🗄 Database Architecture

### Database: `kandypack_db`
**Connection String:** `mysql+pymysql://root:password@localhost:3306/kandypack_db`

### Entity Relationship Overview

```
Users (Staff) ──┐
                ├── Drivers
                └── Assistants

Customers ──> Orders ──> OrderItems ──> Products
                │
                ├── RailAllocations ──> TrainSchedules ──> Trains
                │                            │
                │                            └── RailwayStations ──> Cities
                │
                └── TruckAllocations ──> TruckSchedules ──> Routes
                                              │               │
                                              ├── Trucks      ├── Stores
                                              ├── Drivers     └── Cities
                                              └── Assistants
```

### 15 Database Tables

#### 1. **Users** (Staff Authentication)
- `user_id` (PK) - UUID
- `user_name` - Unique username
- `password_hash` - Hashed password
- `role` - User role (Management, StoreManager, etc.)
- `created_at` - Timestamp

#### 2. **Customers**
- `customer_id` (PK) - UUID
- `customer_user_name` - Unique username
- `customer_name` - Full name
- `phone_number` - Contact number (validated regex)
- `address` - Physical address
- `password_hash` - Hashed password

#### 3. **Orders**
- `order_id` (PK) - UUID
- `customer_id` (FK) - References Customers
- `order_date` - Order placement timestamp
- `deliver_address` - Delivery address
- `status` - Enum: PLACED, SCHEDULED_RAIL, IN_WAREHOUSE, SCHEDULED_ROAD, DELIVERED, FAILED
- `deliver_city_id` (FK) - References Cities
- `full_price` - Total order cost

#### 4. **OrderItems**
- `item_id` (PK) - UUID
- `order_id` (FK) - References Orders
- `store_id` (FK) - Source store
- `product_type_id` (FK) - References Products
- `quantity` - Item quantity (> 0)
- `item_price` - Item subtotal

#### 5. **Products**
- `product_type_id` (PK) - UUID
- `product_name` - Product name
- `space_consumption_rate` - Space required per unit

#### 6. **Cities**
- `city_id` (PK) - UUID
- `city_name` - Unique city name
- `province` - Province/state

#### 7. **RailwayStations**
- `station_id` (PK) - UUID
- `station_name` - Station name
- `city_id` (FK) - References Cities

#### 8. **Stores** (Warehouses)
- `store_id` (PK) - UUID
- `name` - Store name
- `telephone_number` - Contact (validated)
- `address` - Physical address
- `contact_person` - Store manager name
- `station_id` (FK) - Nearest railway station

#### 9. **Routes** (Delivery Routes)
- `route_id` (PK) - UUID
- `store_id` (FK) - Starting store
- `start_city_id` (FK) - Origin city
- `end_city_id` (FK) - Destination city
- `distance` - Distance in km

#### 10. **RouteOrders** (Route Assignment)
- `route_order_id` (PK) - UUID
- `route_id` (FK) - References Routes
- `order_id` (FK) - References Orders

#### 11. **Trains**
- `train_id` (PK) - UUID
- `train_name` - Train identifier
- `capacity` - Cargo capacity

#### 12. **TrainSchedules**
- `schedule_id` (PK) - UUID
- `train_id` (FK) - References Trains
- `station_id` (FK) - References RailwayStations
- `scheduled_date` - Schedule date
- `departure_time` - Departure time
- `arrival_time` - Arrival time
- `status` - Enum: PLANNED, IN_PROGRESS, COMPLETED, CANCELLED

#### 13. **RailAllocations** (Order → Train Assignment)
- `allocation_id` (PK) - UUID
- `order_id` (FK) - References Orders
- `schedule_id` (FK) - References TrainSchedules
- `shipment_date` - Shipment date (validated: must be future)
- `status` - Schedule status

#### 14. **Drivers**
- `driver_id` (PK) - UUID
- `name` - Driver name
- `weekly_working_hours` - Hours worked (0-40)
- `user_id` (FK) - References Users

#### 15. **Assistants** (Driver Helpers)
- `assistant_id` (PK) - UUID
- `name` - Assistant name
- `weekly_working_hours` - Hours worked (0-60)
- `user_id` (FK) - References Users

#### 16. **Trucks**
- `truck_id` (PK) - UUID
- `license_num` - Unique license plate
- `capacity` - Cargo capacity
- `is_active` - Availability status

#### 17. **TruckSchedules**
- `schedule_id` (PK) - UUID
- `route_id` (FK) - References Routes
- `truck_id` (FK) - References Trucks
- `driver_id` (FK) - References Drivers
- `assistant_id` (FK) - References Assistants
- `scheduled_date` - Schedule date
- `departure_time` - Departure time
- `duration` - Trip duration in hours
- `status` - Schedule status

#### 18. **TruckAllocations** (Order → Truck Assignment)
- `allocation_id` (PK) - UUID
- `order_id` (FK) - References Orders
- `schedule_id` (FK) - References TruckSchedules
- `shipment_date` - Shipment date (validated: must be future)
- `status` - Schedule status

### Key Constraints
- **CHECK Constraints**: Validate phone numbers, positive values, working hours
- **UNIQUE Constraints**: Prevent duplicate usernames, phone numbers, route-order pairs
- **FOREIGN KEY Constraints**: Maintain referential integrity
- **ENUM Constraints**: Enforce valid status values
- **Date Validators**: Ensure shipment dates are in the future

---

## 🔐 Authentication & Authorization

### Authentication System

The backend implements **JWT (JSON Web Token)** based authentication with **dual OAuth2** flows:

#### 1. **Staff/User Authentication** (`/users/login`)
- **Users**: Management, StoreManager, Drivers, Assistants
- **Token URL**: `/users/login`
- **OAuth2 Scheme**: `users_auth`

#### 2. **Customer Authentication** (`/customers/login`)
- **Users**: Customers placing orders
- **Token URL**: `/customers/login`
- **OAuth2 Scheme**: `customer_auth`

### Password Security

```python
# Password Hashing
- Primary: pbkdf2_sha256 (modern, salted)
- Fallback: SHA256 hex digest (legacy support)

# Password Verification
1. Try passlib verification (pbkdf2_sha256)
2. If UnknownHashError → Fallback to SHA256 hex comparison
```

### JWT Configuration

```python
SECRET_KEY = "dev-secret-change-me"  # ⚠️ Use env var in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 100
```

### Token Structure

```json
{
  "sub": "user_id or customer_id",
  "role": "Management | StoreManager | Customer",
  "exp": 1234567890
}
```

### Authorization Decorators

```python
# 1. Get Current User (Staff)
current_user: dict = Depends(get_current_user)

# 2. Get Current Customer
current_customer: dict = Depends(get_current_customer)

# 3. Require Management Role
current_user: dict = Depends(require_management)
```

### Role-Based Access Control (RBAC)

| Endpoint | Allowed Roles |
|----------|---------------|
| `GET /orders` | Management, StoreManager |
| `POST /orders` | Customer |
| `GET /customers` | Management |
| `GET /reports/*` | Management |
| `POST /train-schedules` | Management, StoreManager |
| `POST /truck-schedules` | Management, StoreManager |

### Authentication Flow

```
1. User sends credentials (username + password) to login endpoint
   ↓
2. Backend verifies password hash
   ↓
3. If valid → Generate JWT with user_id and role
   ↓
4. Return JWT token to client
   ↓
5. Client includes token in subsequent requests:
   Header: Authorization: Bearer <token>
   ↓
6. Backend validates JWT and extracts user info
   ↓
7. Check role permissions for requested endpoint
   ↓
8. Allow or deny access
```

---

## 🚀 API Endpoints

### Base URL
```
http://localhost:8000
```

### Root Endpoint
```http
GET /
Response: {"message": "Kandypack Supply Chain API"}
```

---

### 👤 Authentication Endpoints

#### Staff/User Login
```http
POST /users/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=password

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user_id": "uuid",
  "user_name": "admin",
  "role": "Management"
}
```

#### Customer Login
```http
POST /customers/login
Content-Type: application/x-www-form-urlencoded

username=customer1&password=password

Response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "customer_id": "uuid",
  "customer_user_name": "customer1",
  "role": "Customer"
}
```

---

### 📦 Order Management

#### Get All Orders
```http
GET /orders
Authorization: Bearer <token>
Roles: Management, StoreManager

Response: [
  {
    "order_id": "uuid",
    "customer_id": "uuid",
    "order_date": "2024-01-15T10:30:00",
    "deliver_address": "123 Main St",
    "status": "PLACED",
    "deliver_city_id": "uuid",
    "full_price": 15000.00
  }
]
```

#### Get Single Order
```http
GET /orders/{order_id}
Authorization: Bearer <token>
Roles: Management, StoreManager
```

#### Create Order
```http
POST /orders
Authorization: Bearer <customer_token>
Roles: Customer
Content-Type: application/json

{
  "customer_id": "uuid",
  "order_date": "2024-01-22T10:00:00",  // Must be 7+ days in future
  "deliver_address": "456 Oak Ave",
  "deliver_city_id": "uuid",
  "full_price": 12500.00
}

Validation:
- Order date must be at least 7 days from today (Sri Lanka timezone)
- Customer must exist
- Price must be positive
```

---

### 👥 Customer Management

#### Get All Customers
```http
GET /customers
Authorization: Bearer <token>
Roles: Management
```

#### Get Customer by ID
```http
GET /customers/{customer_id}
Authorization: Bearer <token>
Roles: Management
```

#### Create Customer
```http
POST /customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "customer_user_name": "newcustomer",
  "customer_name": "John Doe",
  "phone_number": "+94771234567",
  "address": "789 Elm St",
  "password": "securepassword"
}
```

---

### 🏙 City & Location Management

#### Cities (`/cities`)
```http
GET /cities                    # List all cities
GET /cities/{city_id}          # Get city by ID
POST /cities                   # Create city (Management only)
PUT /cities/{city_id}          # Update city
DELETE /cities/{city_id}       # Delete city
```

#### Railway Stations (`/railway-stations`)
```http
GET /railway-stations          # List all stations
GET /railway-stations/{id}     # Get station by ID
POST /railway-stations         # Create station
PUT /railway-stations/{id}     # Update station
DELETE /railway-stations/{id}  # Delete station
```

---

### 🏪 Store Management

```http
GET /stores                    # List all stores
GET /stores/{store_id}         # Get store by ID
POST /stores                   # Create store (Management)
PUT /stores/{store_id}         # Update store
DELETE /stores/{store_id}      # Delete store
```

**Store Schema:**
```json
{
  "store_id": "uuid",
  "name": "Colombo Warehouse",
  "telephone_number": "+94112345678",
  "address": "456 Store Rd",
  "contact_person": "Manager Name",
  "station_id": "uuid"
}
```

---

### 📦 Product Management

```http
GET /products                  # List all products
GET /products/{product_id}     # Get product by ID
POST /products                 # Create product
PUT /products/{product_id}     # Update product
DELETE /products/{product_id}  # Delete product
```

**Product Schema:**
```json
{
  "product_type_id": "uuid",
  "product_name": "Electronics",
  "space_consumption_rate": 1.5
}
```

---

### 🛤 Route Management

```http
GET /routes                    # List all routes
GET /routes/{route_id}         # Get route by ID
POST /routes                   # Create route (Management, StoreManager)
PUT /routes/{route_id}         # Update route
DELETE /routes/{route_id}      # Delete route
```

**Route Schema:**
```json
{
  "route_id": "uuid",
  "store_id": "uuid",
  "start_city_id": "uuid",
  "end_city_id": "uuid",
  "distance": 150
}
```

---

### 🚂 Train Management

#### Trains (`/trains`)
```http
GET /trains                    # List all trains
POST /trains                   # Create train (Management)
GET /trains/{train_id}         # Get train by ID
PUT /trains/{train_id}         # Update train
DELETE /trains/{train_id}      # Delete train
```

#### Train Schedules (`/train-schedules`)
```http
GET /train-schedules           # List schedules
POST /train-schedules          # Create schedule (Management, StoreManager)
GET /train-schedules/{id}      # Get schedule by ID
PUT /train-schedules/{id}      # Update schedule
DELETE /train-schedules/{id}   # Delete schedule
```

**Train Schedule Schema:**
```json
{
  "schedule_id": "uuid",
  "train_id": "uuid",
  "station_id": "uuid",
  "scheduled_date": "2024-01-20",
  "departure_time": "08:00:00",
  "arrival_time": "12:00:00",
  "status": "PLANNED"
}
```

---

### 🚛 Truck Management

#### Trucks (`/trucks`)
```http
GET /trucks                    # List all trucks
POST /trucks                   # Create truck
GET /trucks/{truck_id}         # Get truck by ID
PUT /trucks/{truck_id}         # Update truck
DELETE /trucks/{truck_id}      # Delete truck
```

#### Truck Schedules (`/truck-schedules`)
```http
GET /truck-schedules           # List schedules
POST /truck-schedules          # Create schedule
GET /truck-schedules/{id}      # Get schedule by ID
PUT /truck-schedules/{id}      # Update schedule
DELETE /truck-schedules/{id}   # Delete schedule
```

**Truck Schedule Schema:**
```json
{
  "schedule_id": "uuid",
  "route_id": "uuid",
  "truck_id": "uuid",
  "driver_id": "uuid",
  "assistant_id": "uuid",
  "scheduled_date": "2024-01-20",
  "departure_time": "09:00:00",
  "duration": 4,
  "status": "PLANNED"
}
```

---

### 👨‍✈️ Driver & Assistant Management

#### Drivers (`/drivers`)
```http
GET /drivers                   # List all drivers
POST /drivers                  # Create driver
GET /drivers/{driver_id}       # Get driver by ID
PUT /drivers/{driver_id}       # Update driver
DELETE /drivers/{driver_id}    # Delete driver
```

#### Assistants (`/assistants`)
```http
GET /assistants                # List all assistants
POST /assistants               # Create assistant
GET /assistants/{id}           # Get assistant by ID
PUT /assistants/{id}           # Update assistant
DELETE /assistants/{id}        # Delete assistant
```

**Working Hours Constraints:**
- Drivers: 0-40 hours/week
- Assistants: 0-60 hours/week

---

### 📊 Allocation Endpoints

#### Rail Allocations (`/allocations/rail`)
```http
GET /allocations/rail          # List rail allocations
POST /allocations/rail         # Allocate order to train
GET /allocations/rail/{id}     # Get allocation
PUT /allocations/rail/{id}     # Update allocation
DELETE /allocations/rail/{id}  # Remove allocation
```

#### Truck Allocations (`/allocations/truck`)
```http
GET /allocations/truck         # List truck allocations
POST /allocations/truck        # Allocate order to truck
GET /allocations/truck/{id}    # Get allocation
PUT /allocations/truck/{id}    # Update allocation
DELETE /allocations/truck/{id} # Remove allocation
```

---

### 📈 Reports & Analytics

All reports require **Management** role.

#### Quarterly Sales Report
```http
GET /reports/sales/quarterly?year=2024&quarter=1
Authorization: Bearer <management_token>

Response: [
  {
    "total_sales": 1500000.00,
    "total_orders": 145,
    "quarter": 1,
    "year": 2024
  }
]
```

#### Top Selling Items
```http
GET /reports/sales/top-items?year=2024&quarter=1&limit=20

Response: [
  {
    "product_name": "Electronics",
    "total_quantity": 500,
    "total_revenue": 750000.00,
    "order_count": 85
  }
]
```

#### Sales by City
```http
GET /reports/sales/by-city?start_date=2024-01-01&end_date=2024-03-31

Response: [
  {
    "city_name": "Colombo",
    "total_sales": 500000.00,
    "order_count": 45
  }
]
```

#### Sales by Route
```http
GET /reports/sales/by-route?start_date=2024-01-01&end_date=2024-03-31

Response: [
  {
    "route_id": "uuid",
    "start_city": "Colombo",
    "end_city": "Kandy",
    "total_sales": 250000.00,
    "order_count": 30
  }
]
```

#### Driver Working Hours
```http
GET /reports/driver-hours?start_date=2024-01-01&end_date=2024-01-31

Response: [
  {
    "driver_name": "John Smith",
    "total_hours": 38,
    "trip_count": 12
  }
]
```

#### Assistant Working Hours
```http
GET /reports/assistant-hours?start_date=2024-01-01&end_date=2024-01-31

Response: [
  {
    "assistant_name": "Jane Doe",
    "total_hours": 55,
    "trip_count": 18
  }
]
```

#### Truck Usage by Month
```http
GET /reports/truck-usage?year=2024&month=1

Response: [
  {
    "truck_license": "ABC-1234",
    "total_trips": 25,
    "total_hours": 120,
    "utilization_rate": 0.75
  }
]
```

#### Customer Order History
```http
GET /reports/customer-orders?customer_id=uuid&start_date=2024-01-01&end_date=2024-12-31

Response: [
  {
    "order_id": "uuid",
    "order_date": "2024-01-15",
    "status": "DELIVERED",
    "total_price": 15000.00,
    "items_count": 5
  }
]
```

---

## 📊 Stored Procedures & Reports

The backend uses **8 MySQL stored procedures** for complex analytics:

### 1. `sp_quarterly_sales`
**Purpose:** Calculate total sales for a specific quarter  
**Parameters:** `year INT, quarter INT`  
**Returns:** Total sales, order count  
**File:** `migrations/sql/procs/p_quarterly_sales.sql`

### 2. `sp_top_items_by_quarter`
**Purpose:** Find best-selling products in a quarter  
**Parameters:** `year INT, quarter INT, limit INT`  
**Returns:** Product name, quantity sold, revenue  
**File:** `migrations/sql/procs/mostOrdeditems.sql`

### 3. `sp_sales_by_city`
**Purpose:** Sales breakdown by delivery city  
**Parameters:** `start_date DATE, end_date DATE`  
**Returns:** City name, total sales, order count  
**File:** `migrations/sql/procs/citywisesales.sql`

### 4. `sp_sales_by_route`
**Purpose:** Sales breakdown by delivery route  
**Parameters:** `start_date DATE, end_date DATE`  
**Returns:** Route info, sales, order count  
**File:** `migrations/sql/procs/Routewisesales.sql`

### 5. `sp_driver_work_hours`
**Purpose:** Track driver working hours  
**Parameters:** `start_date DATE, end_date DATE`  
**Returns:** Driver name, hours worked, trip count  
**File:** `migrations/sql/procs/DriverWorkingHourReport.sql`

### 6. `sp_assistant_work_hours`
**Purpose:** Track assistant working hours  
**Parameters:** `start_date DATE, end_date DATE`  
**Returns:** Assistant name, hours worked, trip count  
**File:** `migrations/sql/procs/AssistantWorkingHourReport.sql`

### 7. `sp_truck_usage_month`
**Purpose:** Monthly truck utilization report  
**Parameters:** `year INT, month INT`  
**Returns:** Truck ID, trips, hours, utilization  
**File:** `migrations/sql/procs/TruckUsagePerMonth.sql`

### 8. `sp_customer_order_history`
**Purpose:** Customer's complete order history  
**Parameters:** `customer_id VARCHAR(36), start_date DATE, end_date DATE`  
**Returns:** Order details, status, pricing  
**File:** `migrations/sql/procs/customerOrderHistory.sql`

### Stored Procedure Wrapper

All procedures are called via Python wrapper in `app/utils/reports_procs.py`:

```python
def _call_proc(proc_name, params=()):
    conn = engine.raw_connection()
    cur = conn.cursor()
    cur.callproc(proc_name, params)
    rows = cur.fetchall()
    cols = [d[0] for d in cur.description]
    return [dict(zip(cols, r)) for r in rows]
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Python 3.8+
- MySQL 8.0+
- pip (Python package manager)

### Step 1: Clone Repository
```bash
cd Backend
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r reqirements.txt
```

**Dependencies:**
- fastapi
- uvicorn
- sqlalchemy
- pymysql
- pydantic
- python-jose[cryptography]
- passlib
- bcrypt
- python-multipart
- cryptography
- pytz

### Step 4: Configure Database

1. **Create MySQL Database:**
```sql
CREATE DATABASE kandypack_db;
```

2. **Update Connection String** in `app/core/database.py`:
```python
DB_URL = "mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/kandypack_db"
```

3. **Run Schema Creation:**
```bash
mysql -u root -p kandypack_db < schemas/createtables.sql
mysql -u root -p kandypack_db < schemas/create_indexes.sql
mysql -u root -p kandypack_db < schemas/insert.sql
```

4. **Apply Stored Procedures:**
```bash
python scripts/apply_procs.py
```

### Step 5: Set Environment Variables (Production)
```bash
export KANDYPACK_SECRET_KEY="your-secret-key-here"
export KANDYPACK_ALGORITHM="HS256"
export KANDYPACK_ACCESS_TOKEN_EXPIRE_MINUTES="100"
```

### Step 6: Run Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Step 7: Test API
Open browser: `http://localhost:8000`

Expected response:
```json
{"message": "Kandypack Supply Chain API"}
```

### Step 8: View API Documentation
FastAPI auto-generates interactive docs:

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## 🧪 API Usage Examples

### Example 1: Staff Login & Create Order

```python
import requests

# 1. Staff Login
login_response = requests.post(
    "http://localhost:8000/users/login",
    data={
        "username": "admin",
        "password": "password"
    }
)
token = login_response.json()["access_token"]

# 2. Create Customer (as Management)
headers = {"Authorization": f"Bearer {token}"}
customer_response = requests.post(
    "http://localhost:8000/customers",
    headers=headers,
    json={
        "customer_user_name": "johndoe",
        "customer_name": "John Doe",
        "phone_number": "+94771234567",
        "address": "123 Main St, Colombo",
        "password": "securepass"
    }
)
```

### Example 2: Customer Login & Place Order

```python
import requests
from datetime import datetime, timedelta

# 1. Customer Login
login_response = requests.post(
    "http://localhost:8000/customers/login",
    data={
        "username": "johndoe",
        "password": "securepass"
    }
)
customer_token = login_response.json()["access_token"]
customer_id = login_response.json()["customer_id"]

# 2. Place Order (7+ days in future)
headers = {"Authorization": f"Bearer {customer_token}"}
order_date = datetime.now() + timedelta(days=10)

order_response = requests.post(
    "http://localhost:8000/orders",
    headers=headers,
    json={
        "customer_id": customer_id,
        "order_date": order_date.isoformat(),
        "deliver_address": "456 Oak Ave, Kandy",
        "deliver_city_id": "city-uuid-here",
        "full_price": 25000.00
    }
)
```

### Example 3: Get Quarterly Sales Report

```python
import requests

# 1. Management Login
login_response = requests.post(
    "http://localhost:8000/users/login",
    data={
        "username": "manager",
        "password": "password"
    }
)
token = login_response.json()["access_token"]

# 2. Get Q1 2024 Sales
headers = {"Authorization": f"Bearer {token}"}
report = requests.get(
    "http://localhost:8000/reports/sales/quarterly",
    params={"year": 2024, "quarter": 1},
    headers=headers
)

print(report.json())
# Output: [{"total_sales": 1500000.00, "total_orders": 145, ...}]
```

---

## 🔒 Security Best Practices

### ⚠️ Current Security Issues (TO FIX IN PRODUCTION)

1. **Hardcoded Secret Key**
   - Current: `SECRET_KEY = "dev-secret-change-me"`
   - Fix: Use environment variables

2. **Database Password in Code**
   - Current: Password in `database.py`
   - Fix: Use environment variables

3. **Weak Default Credentials**
   - Fix: Force password change on first login

### ✅ Recommended Production Setup

```python
# app/core/config.py
import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings()
```

**.env file:**
```bash
SECRET_KEY=super-secret-key-min-32-chars
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/kandypack_db
```

---

## 📝 Data Validation Rules

### Order Creation
- ✅ Order date must be **7+ days** in the future (Sri Lanka timezone)
- ✅ Customer must exist
- ✅ Full price must be positive
- ✅ Delivery city must exist

### Working Hours
- ✅ Drivers: 0-40 hours/week
- ✅ Assistants: 0-60 hours/week

### Phone Numbers
- ✅ Must match regex: `^\\+?[0-9-]+$`

### Shipment Dates
- ✅ Must be in the future (validated in ORM)

### Positive Values
- ✅ Distance, capacity, quantity, price, duration

---

## 🐛 Common Errors & Solutions

### Error: `ModuleNotFoundError: No module named 'app'`
**Solution:** Run from Backend directory: `cd Backend && uvicorn app.main:app --reload`

### Error: `sqlalchemy.exc.OperationalError: Access denied`
**Solution:** Check MySQL credentials in `app/core/database.py`

### Error: `401 Unauthorized`
**Solution:** Include valid JWT token in Authorization header

### Error: `403 Forbidden - You cannot access...`
**Solution:** Current user role doesn't have permission for this endpoint

### Error: `Order date must be at least 7 days from today`
**Solution:** Set order_date to be 7+ days in the future

---

## 🚀 Future Enhancements

### Planned Features
1. ✅ Real-time order tracking
2. ✅ Email notifications
3. ✅ WebSocket support for live updates
4. ✅ Rate limiting & throttling
5. ✅ API versioning (`/api/v1/...`)
6. ✅ Comprehensive logging
7. ✅ Unit & integration tests
8. ✅ Docker containerization
9. ✅ CI/CD pipeline
10. ✅ Admin dashboard

---

## 📞 Support & Contact

For issues or questions:
- **GitHub**: hhh-berzerk/kandypack-logistics-platform
- **Branch**: customer

---

## 📄 License

See LICENSE file in repository root.

---

**Last Updated:** October 18, 2025  
**API Version:** 1.0  
**Documentation Version:** 1.0
