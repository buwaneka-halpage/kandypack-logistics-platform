# 🚂 KandyPack Logistics Platform - Railway Deployment Guide

**Complete guide for deploying to Railway.app**

---

## 📋 Table of Contents

1. [Why Railway?](#why-railway)
2. [Prerequisites](#prerequisites)
3. [Deployment Overview](#deployment-overview)
4. [Step 1: Setup Railway Account](#step-1-setup-railway-account)
5. [Step 2: Create MySQL Database](#step-2-create-mysql-database)
6. [Step 3: Deploy Backend](#step-3-deploy-backend)
7. [Step 4: Deploy Frontend](#step-4-deploy-frontend)
8. [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
9. [Step 6: Setup Database Schema](#step-6-setup-database-schema)
10. [Step 7: Connect Services](#step-7-connect-services)
11. [Step 8: Custom Domains](#step-8-custom-domains-optional)
12. [Troubleshooting](#troubleshooting)
13. [Monitoring & Logs](#monitoring--logs)
14. [Costs & Pricing](#costs--pricing)

---

## 🌟 Why Railway?

Railway is perfect for this project because:

- ✅ **Easy Setup** - Deploy in minutes, not hours
- ✅ **Auto HTTPS** - SSL certificates automatically
- ✅ **Managed Database** - MySQL service included
- ✅ **GitHub Integration** - Auto-deploy on push
- ✅ **Environment Variables** - Easy configuration
- ✅ **Logs & Monitoring** - Built-in observability
- ✅ **Custom Domains** - Free custom domain support
- ✅ **Affordable** - $5/month starter plan or free trial

---

## 🔧 Prerequisites

### Required:
1. **Railway Account** - Sign up at [railway.app](https://railway.app)
2. **GitHub Account** - For repository hosting
3. **Git Repository** - Your code pushed to GitHub

### Optional:
- **Custom Domain** - If you want a branded URL
- **Credit Card** - For paid plan (free trial available)

---

## 📊 Deployment Overview

You'll deploy **3 services** on Railway:

```
┌─────────────────────────────────────────┐
│           Railway Project               │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │   MySQL      │  │   Backend    │   │
│  │   Database   │◄─┤   (FastAPI)  │   │
│  │   Port: 3306 │  │   Port: 8000 │   │
│  └──────────────┘  └───────┬──────┘   │
│                             │           │
│                             ▼           │
│                    ┌──────────────┐    │
│                    │   Frontend   │    │
│                    │   (React)    │    │
│                    │   Port: 3000 │    │
│                    └──────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

**Estimated Deployment Time:** 20-30 minutes

---

## 🚀 Step 1: Setup Railway Account

### 1.1 Create Account

1. Go to [railway.app](https://railway.app)
2. Click **"Start a New Project"**
3. Sign up with GitHub (recommended for auto-deploy)
4. Verify your email

### 1.2 Install Railway CLI (Optional but Recommended)

**Windows:**
```powershell
# Using npm
npm install -g @railway/cli

# Or download from railway.app/cli
```

**Mac/Linux:**
```bash
# Using npm
npm install -g @railway/cli

# Or using brew (Mac)
brew install railway
```

**Verify Installation:**
```bash
railway --version
railway login
```

---

## 🗄️ Step 2: Create MySQL Database

### 2.1 Via Railway Dashboard

1. **Login to Railway Dashboard:** https://railway.app/dashboard
2. **Create New Project:**
   - Click **"New Project"**
   - Name it: `kandypack-logistics`

3. **Add MySQL Database:**
   - Click **"+ New"**
   - Select **"Database"**
   - Choose **"Add MySQL"**
   - Railway automatically creates the database

4. **Note Database Credentials:**
   - Click on the MySQL service
   - Go to **"Variables"** tab
   - You'll see:
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLDATABASE`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `DATABASE_URL` (connection string)

### 2.2 Via Railway CLI

```bash
# Login
railway login

# Create new project
railway init

# Add MySQL
railway add --database mysql

# Link to project
railway link
```

---

## 🔧 Step 3: Deploy Backend

### 3.1 Prepare Repository

**Ensure your repo has:**
```
kandypack-logistics-platform/
├── Backend/
│   ├── app/
│   ├── Dockerfile          ✅ (or Dockerfile.railway)
│   ├── railway.toml        ✅
│   └── reqirements.txt     ✅
```

### 3.2 Deploy Backend via Dashboard

1. **In Railway Project:**
   - Click **"+ New"**
   - Select **"GitHub Repo"**
   - Authorize Railway to access your GitHub
   - Select your repository

2. **Configure Backend Service:**
   - Railway detects the Dockerfile
   - Click on the service → **"Settings"**
   - **Root Directory:** Set to `Backend`
   - **Dockerfile Path:** `Dockerfile` (or `Dockerfile.railway`)
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables:**
   Click **"Variables"** tab and add:

   ```bash
   # Database (copy from MySQL service variables)
   DATABASE_URL=mysql+pymysql://MYSQLUSER:MYSQLPASSWORD@MYSQLHOST:MYSQLPORT/MYSQLDATABASE
   DB_HOST=MYSQLHOST (from MySQL service)
   DB_PORT=MYSQLPORT (from MySQL service)
   DB_NAME=MYSQLDATABASE (from MySQL service)
   DB_USER=MYSQLUSER (from MySQL service)
   DB_PASSWORD=MYSQLPASSWORD (from MySQL service)
   
   # JWT Authentication
   SECRET_KEY=your-super-secret-32-char-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Application
   ENVIRONMENT=production
   DEBUG=false
   TZ=Asia/Colombo
   ```

   **Generate SECRET_KEY:**
   ```bash
   openssl rand -hex 32
   ```

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build to complete (5-10 minutes first time)
   - Check logs for success

5. **Generate Public URL:**
   - Go to **"Settings"**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://kandypack-backend.up.railway.app`)

### 3.3 Deploy Backend via CLI

```bash
# Navigate to backend directory
cd Backend

# Initialize Railway
railway init

# Set root directory
railway up

# Add environment variables
railway variables set SECRET_KEY=$(openssl rand -hex 32)
railway variables set ENVIRONMENT=production
railway variables set DEBUG=false

# Deploy
railway up

# Get service URL
railway domain
```

---

## 🎨 Step 4: Deploy Frontend

### 4.1 Deploy Frontend via Dashboard

1. **In Railway Project:**
   - Click **"+ New"**
   - Select **"GitHub Repo"** (same repo)
   - Create new service

2. **Configure Frontend Service:**
   - Click on the service → **"Settings"**
   - **Service Name:** `frontend`
   - **Root Directory:** `frontend/UI`
   - **Dockerfile Path:** `Dockerfile` (or `Dockerfile.railway`)
   - **Start Command:** `npm start`

3. **Set Environment Variables:**
   Click **"Variables"** tab and add:

   ```bash
   # API URL (use backend Railway URL from Step 3.2.5)
   VITE_API_BASE_URL=https://your-backend-url.up.railway.app
   
   # Node Environment
   NODE_ENV=production
   TZ=Asia/Colombo
   ```

4. **Deploy:**
   - Click **"Deploy"**
   - Wait for build (5-10 minutes)

5. **Generate Public URL:**
   - Go to **"Settings"**
   - Click **"Generate Domain"**
   - This is your app URL! (e.g., `https://kandypack.up.railway.app`)

### 4.2 Deploy Frontend via CLI

```bash
# Navigate to frontend directory
cd frontend/UI

# Link to project
railway link

# Create new service
railway up

# Add environment variables
railway variables set VITE_API_BASE_URL=https://your-backend-url.up.railway.app
railway variables set NODE_ENV=production

# Deploy
railway up

# Get service URL
railway domain
```

---

## ⚙️ Step 5: Configure Environment Variables

### Reference All Variables by Service:

#### **MySQL Service (Provided by Railway)**
- `MYSQLHOST` - Database host
- `MYSQLPORT` - Database port (3306)
- `MYSQLDATABASE` - Database name
- `MYSQLUSER` - Database user
- `MYSQLPASSWORD` - Database password
- `DATABASE_URL` - Full connection string

#### **Backend Service**
```bash
# Database Connection (use values from MySQL service)
DATABASE_URL=mysql+pymysql://user:pass@host:port/db
DB_HOST=<from MySQL service>
DB_PORT=<from MySQL service>
DB_NAME=<from MySQL service>
DB_USER=<from MySQL service>
DB_PASSWORD=<from MySQL service>

# JWT Authentication
SECRET_KEY=<generate with: openssl rand -hex 32>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Application Settings
ENVIRONMENT=production
DEBUG=false
TZ=Asia/Colombo
```

#### **Frontend Service**
```bash
# API URL (use backend Railway URL)
VITE_API_BASE_URL=https://your-backend.up.railway.app

# Application Settings
NODE_ENV=production
TZ=Asia/Colombo
```

### How to Add Variables in Railway:

1. Click on service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Enter name and value
5. Click **"Add"**
6. Service auto-redeploys

### Pro Tip: Reference Variables Between Services

Railway allows you to reference variables:
```bash
# In backend, reference MySQL service variables
DATABASE_URL=${{MySQL.DATABASE_URL}}
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
```

---

## 🗃️ Step 6: Setup Database Schema

### 6.1 Via Railway Dashboard (SQL Editor)

1. **Access MySQL Service:**
   - Click on MySQL service
   - Click **"Connect"** tab
   - Copy connection command or use web SQL editor (if available)

2. **Connect Locally:**
   ```bash
   # Using mysql client
   mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -pMYSQLPASSWORD MYSQLDATABASE
   ```

3. **Run Schema Files:**
   ```sql
   -- From local terminal connected to Railway MySQL
   source Backend/schemas/createtables.sql;
   source Backend/schemas/insert.sql;
   source Backend/schemas/insert_additional_schedules.sql;
   ```

### 6.2 Via Backend Service (Recommended)

**Option A: Manual from Backend Container**

1. Open Railway dashboard → Backend service
2. Click **"Settings"** → scroll to **"Deploy Logs"**
3. Once deployed, go to **"Deploy"** tab
4. Click on latest deployment → **"View Logs"**
5. You can also use Railway CLI:

```bash
# Connect to backend service
railway run bash

# Inside container, run Python script
python reset_database.py
python apply_stored_procedures.py
python apply_additional_data.py
```

**Option B: Add Init Script to Backend**

Create `Backend/init_db.py`:
```python
import os
from sqlalchemy import create_engine, text

# Read DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# Read and execute schema files
schema_files = [
    "schemas/createtables.sql",
    "schemas/insert.sql", 
    "schemas/insert_additional_schedules.sql"
]

with engine.connect() as conn:
    for file_path in schema_files:
        print(f"Executing {file_path}...")
        with open(file_path, 'r') as f:
            sql = f.read()
            # Split by semicolon and execute each statement
            for statement in sql.split(';'):
                if statement.strip():
                    conn.execute(text(statement))
    conn.commit()
    
print("Database initialized successfully!")
```

Then run:
```bash
railway run python Backend/init_db.py
```

---

## 🔗 Step 7: Connect Services

### 7.1 Update Backend CORS Settings

Ensure `Backend/app/main.py` allows your frontend domain:

```python
from fastapi.middleware.cors import CORSMiddleware

# Add your Railway frontend URL
origins = [
    "http://localhost:3000",
    "https://your-frontend.up.railway.app",  # Add this
    "https://your-custom-domain.com",  # If using custom domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**After changing code:**
- Push to GitHub → Railway auto-deploys

### 7.2 Update Frontend API URL

Make sure `VITE_API_BASE_URL` in frontend points to backend:
```bash
VITE_API_BASE_URL=https://your-backend.up.railway.app
```

### 7.3 Test Connection

1. **Open Frontend URL:** `https://your-frontend.up.railway.app`
2. **Open Browser Console** (F12)
3. **Try Login** - should connect to backend
4. **Check Network Tab** - verify API calls succeed

---

## 🌐 Step 8: Custom Domains (Optional)

### 8.1 Add Custom Domain to Frontend

1. **In Railway Dashboard:**
   - Click on **Frontend service**
   - Go to **"Settings"**
   - Scroll to **"Domains"**
   - Click **"+ Custom Domain"**
   - Enter your domain: `app.yourdomain.com`

2. **Configure DNS:**
   - Go to your domain registrar (GoDaddy, Namecheap, etc.)
   - Add CNAME record:
     ```
     Type: CNAME
     Name: app (or @ for root domain)
     Value: your-frontend.up.railway.app
     ```

3. **Wait for DNS Propagation** (5-60 minutes)
4. **Railway Auto-Generates SSL Certificate**

### 8.2 Add Custom Domain to Backend

1. **In Railway Dashboard:**
   - Click on **Backend service**
   - Go to **"Settings"** → **"Domains"**
   - Click **"+ Custom Domain"**
   - Enter: `api.yourdomain.com`

2. **Configure DNS:**
   ```
   Type: CNAME
   Name: api
   Value: your-backend.up.railway.app
   ```

3. **Update Frontend Environment Variable:**
   ```bash
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

---

## 🔧 Troubleshooting

### Common Issues:

#### **1. Build Fails**

**Symptoms:**
- "Build failed" in Railway logs
- Error during docker build

**Solutions:**
```bash
# Check build logs in Railway dashboard
# Look for missing dependencies

# Verify Dockerfile exists
# Check reqirements.txt has all dependencies

# Try building locally first
docker build -t test-backend ./Backend
```

#### **2. Database Connection Error**

**Symptoms:**
- "Can't connect to MySQL server"
- "Access denied for user"

**Solutions:**
```bash
# Verify environment variables match MySQL service
# DATABASE_URL should reference MySQL service variables

# In Railway: Use variable references
DATABASE_URL=${{MySQL.DATABASE_URL}}

# Check MySQL service is running
# Railway Dashboard → MySQL service → should show "Active"
```

#### **3. Frontend Can't Reach Backend**

**Symptoms:**
- Network errors in browser console
- CORS errors

**Solutions:**
```bash
# Check VITE_API_BASE_URL is set correctly
# Should be: https://your-backend.up.railway.app

# Verify backend CORS allows frontend domain
# Update Backend/app/main.py origins list

# Check backend is deployed and running
# Visit: https://your-backend.up.railway.app/docs
```

#### **4. Environment Variables Not Working**

**Solutions:**
- Railway requires service restart after adding variables
- Click service → **"Settings"** → **"Restart"**
- Or redeploy: **"Deployments"** → **"Redeploy"**

#### **5. Build Takes Too Long**

**Solutions:**
- First build can take 10-15 minutes (normal)
- Railway caches layers for subsequent builds (faster)
- Check Railway status page: status.railway.app

#### **6. Port Binding Error**

**Solution:**
- Railway provides `$PORT` environment variable
- Make sure your app listens on `$PORT`
- Backend: `--port $PORT` in start command
- Frontend: Railway handles this automatically

---

## 📊 Monitoring & Logs

### View Logs

**Via Dashboard:**
1. Click on service
2. Go to **"Deployments"** tab
3. Click on active deployment
4. View real-time logs

**Via CLI:**
```bash
# View backend logs
railway logs --service backend

# View frontend logs  
railway logs --service frontend

# Follow logs in real-time
railway logs --follow
```

### Metrics

Railway provides:
- **CPU Usage**
- **Memory Usage**
- **Network Traffic**
- **Deployment History**

Access: Service → **"Metrics"** tab

### Health Checks

Railway automatically monitors:
- Service uptime
- HTTP response codes
- Deployment success/failure

### Alerts

Railway sends email notifications for:
- Failed deployments
- Service crashes
- Billing alerts

---

## 💰 Costs & Pricing

### Railway Pricing (as of 2024)

**Free Trial:**
- $5 credit (no credit card)
- All features included
- ~100 hours of runtime

**Starter Plan - $5/month:**
- $5 credit included
- Additional usage: pay-as-you-go
- Typical costs for this stack:
  - Backend: ~$3-5/month
  - Frontend: ~$2-3/month
  - MySQL: ~$2-3/month
  - **Total: ~$7-11/month**

**Resource Usage:**
- **Backend:** 512MB RAM, 1 vCPU
- **Frontend:** 512MB RAM, 1 vCPU
- **MySQL:** 1GB RAM, 1 vCPU

### Cost Optimization Tips:

1. **Scale Down in Dev:**
   - Use free tier for development
   - Deploy production only when ready

2. **Use Single Database:**
   - One MySQL instance for all environments

3. **Optimize Images:**
   - Use multi-stage Docker builds
   - Smaller images = faster deploys = lower costs

4. **Monitor Usage:**
   - Railway Dashboard → **"Usage"**
   - Set spending limits

---

## 🚀 Deployment Checklist

### Pre-Deployment:
- [ ] Code pushed to GitHub
- [ ] All dependencies in `reqirements.txt` and `package.json`
- [ ] Dockerfiles tested locally
- [ ] Environment variables documented

### Railway Setup:
- [ ] Railway account created
- [ ] Project created
- [ ] MySQL service added
- [ ] Database credentials noted

### Backend Deployment:
- [ ] Backend service created
- [ ] Root directory set to `Backend`
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Public URL generated
- [ ] API docs accessible (`/docs`)

### Frontend Deployment:
- [ ] Frontend service created
- [ ] Root directory set to `frontend/UI`
- [ ] `VITE_API_BASE_URL` set to backend URL
- [ ] Environment variables configured
- [ ] Public URL generated
- [ ] App loads in browser

### Database Setup:
- [ ] Schema files executed
- [ ] Initial data loaded
- [ ] Stored procedures applied
- [ ] Test queries successful

### Final Checks:
- [ ] Frontend connects to backend
- [ ] Login works
- [ ] CORS configured correctly
- [ ] SSL certificates active (HTTPS)
- [ ] Custom domains configured (if applicable)
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

## 📝 Quick Commands Reference

```bash
# Railway CLI

# Login
railway login

# Link to project
railway link

# Deploy
railway up

# View logs
railway logs

# Add variable
railway variables set KEY=value

# View variables
railway variables

# Open service in browser
railway open

# Run command in Railway environment
railway run python script.py

# Get service status
railway status
```

---

## 🎉 Success!

Your KandyPack Logistics Platform is now deployed on Railway!

**Access Your Application:**
- **Frontend:** `https://your-frontend.up.railway.app`
- **Backend API:** `https://your-backend.up.railway.app/docs`
- **Database:** Managed by Railway

**Next Steps:**
1. Test all functionality
2. Set up custom domains
3. Configure monitoring
4. Set up automated backups
5. Share with your team!

---

## 📞 Support Resources

- **Railway Documentation:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Railway Status:** https://status.railway.app
- **Railway Blog:** https://blog.railway.app

---

**Deployment Guide Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Platform:** Railway.app

**Happy Deploying! 🚂**

