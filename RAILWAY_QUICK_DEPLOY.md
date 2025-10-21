# 🚂 Railway Quick Deploy Guide

**Deploy KandyPack to Railway in 15 minutes!**

---

## 📋 Prerequisites

- ✅ Railway account (signup at [railway.app](https://railway.app))
- ✅ GitHub account
- ✅ Code pushed to GitHub

---

## 🚀 Deployment Steps

### **1. Create Railway Project** (2 min)

```bash
1. Go to railway.app/dashboard
2. Click "New Project"
3. Name it: kandypack-logistics
```

### **2. Add MySQL Database** (1 min)

```bash
1. In your project, click "+ New"
2. Select "Database" → "Add MySQL"
3. Railway creates database automatically
4. Click MySQL service → "Variables" tab
5. Note down: MYSQLHOST, MYSQLPORT, MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD
```

### **3. Deploy Backend** (5 min)

```bash
1. Click "+ New" → "GitHub Repo"
2. Select your repository
3. Railway detects Dockerfile and deploys

Configure:
- Click service → "Settings"
- Set "Root Directory": Backend
- Set "Start Command": uvicorn app.main:app --host 0.0.0.0 --port $PORT

Add Variables (click "Variables" tab):
DATABASE_URL = mysql+pymysql://USER:PASS@HOST:PORT/DB (copy from MySQL service)
SECRET_KEY = <run: openssl rand -hex 32>
ALGORITHM = HS256
ACCESS_TOKEN_EXPIRE_MINUTES = 30
ENVIRONMENT = production
DEBUG = false

Generate Domain:
- Settings → "Generate Domain"
- Copy URL: https://your-backend.up.railway.app
```

### **4. Deploy Frontend** (5 min)

```bash
1. Click "+ New" → "GitHub Repo" (same repo again)
2. Create new service

Configure:
- Click service → "Settings"
- Set "Root Directory": frontend/UI
- Set "Start Command": npm start

Add Variables:
VITE_API_BASE_URL = https://your-backend.up.railway.app (from step 3)
NODE_ENV = production

Generate Domain:
- Settings → "Generate Domain"
- This is your app URL!
```

### **5. Setup Database** (2 min)

```bash
# Option A: Via Railway CLI
railway login
railway link
railway run python Backend/reset_database.py

# Option B: Via MySQL Client
mysql -h MYSQLHOST -P MYSQLPORT -u MYSQLUSER -pMYSQLPASSWORD MYSQLDATABASE
source Backend/schemas/createtables.sql;
source Backend/schemas/insert.sql;
```

---

## ✅ You're Done!

**Access your app:**
- Frontend: `https://your-frontend.up.railway.app`
- Backend API: `https://your-backend.up.railway.app/docs`

---

## 🔧 Quick Troubleshooting

### Build Failed?
- Check Railway deploy logs
- Verify Dockerfile exists in Backend/ and frontend/UI/

### Can't Connect to Database?
- Verify DATABASE_URL matches MySQL service variables
- Use Railway's variable references: `${{MySQL.DATABASE_URL}}`

### Frontend Can't Reach Backend?
- Check VITE_API_BASE_URL is set correctly
- Update Backend CORS to allow frontend domain

---

## 📊 Expected Costs

**Monthly Cost:** ~$7-11/month
- Backend: $3-5
- Frontend: $2-3
- MySQL: $2-3

**Free Trial:** $5 credit (no credit card needed)

---

## 📚 Need More Help?

See full guide: **RAILWAY_DEPLOYMENT_GUIDE.md**

Railway Docs: https://docs.railway.app

---

**Happy Deploying! 🎉**

