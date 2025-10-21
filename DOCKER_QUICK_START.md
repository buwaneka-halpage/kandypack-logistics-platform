# 🚀 Docker Quick Start Guide

**Get KandyPack up and running in 5 minutes!**

---

## Prerequisites

- Docker & Docker Compose installed
- 4GB RAM minimum
- 10GB free disk space

---

## Quick Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd kandypack-logistics-platform
```

### 2. Create Environment File
```bash
# Copy the template
cp .env-template .env

# Edit with your values
nano .env
```

**Minimum changes needed in `.env`:**
```bash
# Change these for security
MYSQL_ROOT_PASSWORD=YOUR_STRONG_PASSWORD
MYSQL_PASSWORD=YOUR_STRONG_PASSWORD
SECRET_KEY=$(openssl rand -hex 32)
```

### 3. Start Everything
```bash
# Build and start all services
docker compose up -d

# Watch logs
docker compose logs -f
```

### 4. Wait for Services to Start

Watch the logs until you see:
- MySQL: `ready for connections`
- Backend: `Application startup complete`
- Frontend: `compiled successfully`

Takes 2-3 minutes on first run.

### 5. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/docs
- **Database:** localhost:3306

---

## Essential Commands

```bash
# Start
docker compose up -d

# Stop
docker compose down

# View logs
docker compose logs -f [backend|frontend|mysql]

# Restart service
docker compose restart backend

# Rebuild after code changes
docker compose up -d --build

# Stop and remove everything (including database)
docker compose down -v
```

---

## Troubleshooting

### Port Already in Use
```bash
# Change ports in .env
MYSQL_PORT=3307
BACKEND_PORT=8001
FRONTEND_PORT=3001
```

### Can't Connect to Database
```bash
# Wait for MySQL to be ready
docker compose logs mysql

# Restart backend after MySQL is up
docker compose restart backend
```

### Build Errors
```bash
# Clean everything and rebuild
docker compose down -v
docker system prune -a
docker compose build --no-cache
docker compose up -d
```

---

## Database Setup

### Initial Schema
```bash
# Access MySQL container
docker compose exec mysql bash

# Inside container
mysql -u root -p${MYSQL_ROOT_PASSWORD} kandypackdb

# Load schema
source /docker-entrypoint-initdb.d/createtables.sql
source /docker-entrypoint-initdb.d/insert.sql
```

### Backup Database
```bash
docker compose exec mysql mysqldump -u root -p kandypackdb > backup.sql
```

### Restore Database
```bash
docker compose exec -T mysql mysql -u root -p kandypackdb < backup.sql
```

---

## Production Deployment

See **`DOCKER_DEPLOYMENT_GUIDE.md`** for full production setup including:
- SSL/TLS configuration
- Nginx reverse proxy
- Domain setup
- Security hardening
- Monitoring
- Automated backups

---

## Need Help?

Check the full guide: `DOCKER_DEPLOYMENT_GUIDE.md`

---

**You're all set! 🎉**

Access your application at http://localhost:3000

