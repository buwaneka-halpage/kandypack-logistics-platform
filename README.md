# KandyPack Logistics Platform

A comprehensive supply chain management system for logistics operations in Sri Lanka, featuring warehouse management, order tracking, route optimization, and fleet scheduling.

## 🚀 Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```powershell
# Set MySQL password
$env:MYSQL_PASSWORD="25747#Xman"

# Navigate to Backend directory
cd Backend

# Install dependencies
pip install -r requirements.txt

# Setup database (creates DB, tables, sample data, stored procedures)
python setup_database.py

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend will be running at:** http://localhost:8000  
**API Documentation:** http://localhost:8000/docs

### Frontend Setup

```powershell
# Navigate to Frontend directory
cd frontend/UI

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend will be running at:** http://localhost:5173

---

## 📚 Documentation

### Main Guides

| Document | Description | Link |
|----------|-------------|------|
| **Setup Guide** | Complete database and backend setup with troubleshooting | [SETUP_GUIDE.md](./SETUP_GUIDE.md) |
| **Connection Guide** | Frontend-backend integration, API mapping, authentication flow | [FRONTEND_BACKEND_CONNECTION.md](./FRONTEND_BACKEND_CONNECTION.md) |
| **Backend API Docs** | Endpoint specifications and API documentation | [BACKEND_DOCUMENTATION.md](./BACKEND_DOCUMENTATION.md) |
| **Project Spec** | Original project requirements and specifications | [KandyPack.docx.pdf](./KandyPack.docx.pdf) |

---

## 🏗️ Architecture

```
kandypack-logistics-platform/
├── Backend/                     # FastAPI backend
│   ├── app/
│   │   ├── api/                # API route handlers
│   │   ├── core/               # Core functionality (DB, auth, models)
│   │   └── main.py            # FastAPI application
│   ├── schemas/               # SQL table definitions
│   ├── migrations/            # Database migrations & procedures
│   ├── scripts/               # Setup and utility scripts
│   └── setup_database.py      # Automated DB setup
│
├── frontend/                  # React Router v7 frontend
│   └── UI/
│       ├── app/
│       │   ├── components/    # React components
│       │   ├── routes/        # Page routes
│       │   ├── services/      # API service layer
│       │   └── hooks/         # Custom React hooks
│       ├── .env              # Environment configuration
│       └── package.json
│
└── Documentation/             # Project documentation
    ├── SETUP_GUIDE.md
    └── FRONTEND_BACKEND_CONNECTION.md
```

---

## 🔐 Test Credentials

### Staff/Admin Users

| Username | Password | Role | Access |
|----------|----------|------|--------|
| admin | admin123 | Management | Full system access |
| manager1 | admin123 | Management | Full system access |
| sysadmin | admin123 | SystemAdmin | System administration |
| colombo_manager | manager123 | StoreManager | Colombo warehouse only |
| kandy_manager | manager123 | StoreManager | Kandy warehouse only |
| galle_manager | manager123 | StoreManager | Galle warehouse only |
| colombo_staff1 | staff123 | WarehouseStaff | Colombo operations |
| kandy_staff | staff123 | WarehouseStaff | Kandy operations |

### Customer Accounts

| Username | Password | Type |
|----------|----------|------|
| customer1 | customer123 | Customer |
| customer2 | customer123 | Customer |
| customer3 | customer123 | Customer |

---

## 🛠️ Technology Stack

### Backend
- **Framework:** FastAPI
- **Database:** MySQL 8.0
- **ORM:** SQLAlchemy with PyMySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Server:** Uvicorn (ASGI)

### Frontend
- **Framework:** React 19
- **Router:** React Router v7
- **Build Tool:** Vite
- **UI Library:** Radix UI + Tailwind CSS
- **Charts:** Recharts
- **Maps:** Leaflet + React-Leaflet
- **Language:** TypeScript

### Database
- **DBMS:** MySQL
- **Tables:** 18 core tables
- **Stored Procedures:** 8 reporting procedures
- **Sample Data:** Pre-populated test data

---

## ✨ Features

### 🏢 Warehouse Management
- Multiple warehouse support
- Inventory tracking
- Warehouse staff assignment
- Role-based warehouse access

### 📦 Order Management
- Order creation and tracking
- Status management (Placed, In Progress, Completed, Cancelled, In Warehouse)
- Warehouse assignment (for Management)
- Customer order history

### 🚚 Fleet Management
- **Trucks:** Management and scheduling
- **Trains:** Railway logistics integration
- **Drivers:** Working hour tracking
- **Assistants:** Schedule management

### 🗺️ Route Optimization
- Route creation and management
- Distance calculation
- City-to-city routing
- Railway station integration

### 📊 Analytics & Reports
- Quarterly sales reports
- City-wise sales analysis
- Route-wise sales tracking
- Driver/Assistant working hours
- Truck usage per month
- Top ordered items
- Customer order history

### 🔐 Security
- JWT-based authentication
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- Protected API endpoints
- CORS configuration

---

## 🎯 User Roles & Permissions

| Role | Can View | Can Create | Can Update | Can Delete | Special Access |
|------|----------|------------|------------|------------|----------------|
| **Management** | All data | ✅ All | ✅ All | ✅ All | Assign orders, View reports |
| **SystemAdmin** | All data | ✅ System config | ✅ System config | ✅ System config | System management |
| **StoreManager** | Warehouse-specific | ✅ Limited | ✅ Warehouse data | ❌ | Warehouse operations |
| **WarehouseStaff** | Warehouse-specific | ❌ | ✅ Limited | ❌ | Daily operations |
| **DriverAssistant** | Own schedules | ❌ | ✅ Status updates | ❌ | Route updates |
| **Customer** | Own orders | ✅ Own orders | ✅ Own orders | ❌ | Order tracking |

---

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=25747#Xman
MYSQL_DATABASE=kandypack_db

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Environment Variables

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000

# App Settings
VITE_APP_NAME="KandyPack Logistics"
VITE_APP_VERSION="1.0.0"

# Feature Flags
VITE_ENABLE_MAP=true
VITE_ENABLE_REPORTS=true
```

---

## 📡 API Endpoints

### Authentication
- `POST /users/login` - Staff/user authentication
- `POST /customers/login` - Customer authentication

### Orders
- `GET /orders` - List all orders
- `GET /orders/{id}` - Get order details
- `POST /orders` - Create new order
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order
- `POST /orders/{id}/assign-warehouse` - Assign to warehouse

### Resources
- Cities: `/cities`
- Railway Stations: `/railway-stations`
- Stores/Warehouses: `/stores`
- Products: `/products`
- Routes: `/routes`
- Trains: `/trains`
- Trucks: `/trucks`
- Drivers: `/drivers`
- Assistants: `/assistants`

### Reports (Management Only)
- `/reports/sales/quarterly` - Quarterly sales
- `/reports/sales/by-city` - Sales by city
- `/reports/sales/by-route` - Sales by route
- `/reports/work-hours/drivers` - Driver working hours
- `/reports/work-hours/assistants` - Assistant working hours
- `/reports/truck-usage` - Truck utilization

**Full API documentation:** http://localhost:8000/docs

---

## 🧪 Testing

### Test the Backend

```powershell
# Test root endpoint
curl http://localhost:8000/

# Test login
curl -X POST http://localhost:8000/users/login `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=admin&password=admin123"

# Test authenticated endpoint
curl http://localhost:8000/orders `
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test the Frontend

1. Open http://localhost:5173
2. Click "Login"
3. Enter credentials (e.g., admin/admin123)
4. Navigate through dashboard
5. Test creating/viewing orders
6. Check warehouse assignment (Management role)

---

## 📊 Database Schema

### Core Tables (18 total)

**User Management:**
- users - System users with roles
- customers - Customer accounts

**Geography:**
- cities - Cities in Sri Lanka
- railway_stations - Railway station locations

**Facilities:**
- stores - Warehouses/distribution centers

**Orders:**
- orders - Customer orders
- order_items - Order line items
- products - Product catalog

**Routing:**
- routes - Defined routes between cities
- route_orders - Route-order assignments

**Rail Transport:**
- trains - Train fleet
- train_schedules - Train schedules
- rail_allocations - Order-to-train allocations

**Road Transport:**
- trucks - Truck fleet
- truck_schedules - Truck schedules
- truck_allocations - Order-to-truck allocations

**Personnel:**
- drivers - Driver information
- assistants - Driver assistants

---

## 🔄 Development Workflow

### Backend Development

```powershell
# Make code changes
# Server auto-reloads with --reload flag

# Test in Swagger UI
# Open http://localhost:8000/docs

# Check logs in terminal
```

### Frontend Development

```powershell
# Make code changes
# Vite auto-reloads on save

# Test in browser
# Check Network tab in DevTools

# View console for errors
```

### Database Changes

```powershell
# Update SQL files in Backend/schemas/
# Re-run setup
python setup_database.py

# Or apply specific migrations
# Add stored procedures to migrations/sql/procs/
python scripts/apply_procs_pymysql.py --user root --db kandypack_db
```

---

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `Get-Service MySQL*`
- Verify password: `$env:MYSQL_PASSWORD="25747#Xman"`
- Check port 8000 is available

### Frontend can't connect to backend
- Verify backend is running on port 8000
- Check `.env` file exists in `frontend/UI/`
- Ensure `VITE_API_BASE_URL=http://localhost:8000`
- Check browser console for CORS errors

### Authentication fails
- Verify credentials match test accounts
- Check password is correct (case-sensitive)
- Ensure database has sample users
- Check JWT token in localStorage

### Database errors
- Re-run setup script: `python setup_database.py`
- Check MySQL credentials
- Verify database exists: `SHOW DATABASES;`
- Check tables exist: `USE kandypack_db; SHOW TABLES;`

---

## 📖 Additional Resources

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLAlchemy Docs](https://docs.sqlalchemy.org/)

### Tools
- **Swagger UI:** Interactive API docs at `/docs`
- **ReDoc:** Alternative API docs at `/redoc`
- **Postman:** API testing and collections
- **MySQL Workbench:** Database management

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

See [LICENSE](./LICENSE) file for details.

---

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review troubleshooting section
- Check API docs at http://localhost:8000/docs
- Review sample credentials

---

## ✅ Status

🟢 **FULLY OPERATIONAL**

- ✅ Database setup complete
- ✅ Backend API running
- ✅ Frontend connected
- ✅ Authentication working
- ✅ CORS configured
- ✅ Sample data loaded
- ✅ Stored procedures deployed
- ✅ Documentation complete

---

**Version:** 1.0.0  
**Last Updated:** October 19, 2025  
**Status:** Production Ready ✅

---

*Built with ❤️ for efficient logistics management*
