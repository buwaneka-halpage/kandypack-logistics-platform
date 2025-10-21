# KandyPack Logistics Platform - Docker Deployment Guide

**Complete guide for containerizing and deploying the application**

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Quick Start](#quick-start)
4. [Configuration](#configuration)
5. [Building Images](#building-images)
6. [Running the Application](#running-the-application)
7. [Database Setup](#database-setup)
8. [Production Deployment](#production-deployment)
9. [Troubleshooting](#troubleshooting)
10. [Monitoring & Maintenance](#monitoring--maintenance)

---

## 🚀 Prerequisites

### Required Software

- **Docker Engine:** 20.10+
- **Docker Compose:** 2.0+
- **Git:** For cloning the repository

### Installation

#### **Ubuntu/Debian:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get update
sudo apt-get install docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

#### **Windows:**
- Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

#### **macOS:**
- Download and install [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)

### Verify Installation

```bash
docker --version
# Output: Docker version 24.0.x

docker compose version
# Output: Docker Compose version v2.x.x
```

---

## 📁 Project Structure

```
kandypack-logistics-platform/
├── Backend/
│   ├── app/                      # Application code
│   ├── schemas/                  # Database schemas
│   ├── migrations/               # Database migrations
│   ├── Dockerfile               # Backend container config
│   ├── .dockerignore           # Files to exclude from image
│   └── reqirements.txt         # Python dependencies
├── frontend/
│   └── UI/
│       ├── app/                 # React application
│       ├── public/              # Static assets
│       ├── Dockerfile          # Frontend container config
│       ├── .dockerignore      # Files to exclude from image
│       └── package.json       # Node dependencies
├── nginx/
│   ├── nginx.conf             # Nginx configuration
│   └── ssl/                   # SSL certificates (production)
├── docker-compose.yml         # Multi-container orchestration
├── .env.example              # Environment variables template
└── DOCKER_DEPLOYMENT_GUIDE.md # This file
```

---

## ⚡ Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd kandypack-logistics-platform
```

### 2. Create Environment File

```bash
# Copy the example environment file
cp .env.example .env

# Edit with your values
nano .env  # or use your preferred editor
```

### 3. Start All Services

```bash
# Build and start all containers
docker compose up -d

# View logs
docker compose logs -f
```

### 4. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs
- **MySQL:** localhost:3306

---

## ⚙️ Configuration

### Environment Variables

Edit the `.env` file with your configuration:

```bash
# Database
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_DATABASE=kandypackdb
MYSQL_USER=kandypack
MYSQL_PASSWORD=your_secure_password
MYSQL_PORT=3306

# Backend
BACKEND_PORT=8000
SECRET_KEY=your-super-secret-jwt-key-minimum-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
FRONTEND_PORT=3000
VITE_API_BASE_URL=http://localhost:8000

# Environment
ENVIRONMENT=production
DEBUG=false
TZ=Asia/Colombo
```

### Important Security Notes

⚠️ **For Production:**
1. **Change all default passwords**
2. **Generate a strong SECRET_KEY:**
   ```bash
   openssl rand -hex 32
   ```
3. **Never commit `.env` to version control**
4. **Use strong, unique passwords for database**
5. **Enable SSL/TLS certificates**

---

## 🏗️ Building Images

### Build All Images

```bash
# Build all services
docker compose build

# Build with no cache (force rebuild)
docker compose build --no-cache
```

### Build Individual Services

```bash
# Backend only
docker compose build backend

# Frontend only
docker compose build frontend

# MySQL (uses official image, no build needed)
```

### View Built Images

```bash
docker images | grep kandypack
```

---

## 🚀 Running the Application

### Start All Services

```bash
# Start in detached mode (background)
docker compose up -d

# Start with logs visible
docker compose up

# Start specific services
docker compose up -d mysql backend
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes (⚠️ deletes database data)
docker compose down -v

# Stop specific service
docker compose stop backend
```

### Restart Services

```bash
# Restart all services
docker compose restart

# Restart specific service
docker compose restart backend
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Last 100 lines
docker compose logs --tail=100 backend
```

### Check Service Status

```bash
# View running containers
docker compose ps

# View resource usage
docker stats
```

---

## 🗄️ Database Setup

### Initial Database Setup

The MySQL container automatically runs initialization scripts from `Backend/schemas/`:

1. **First Start:**
   ```bash
   docker compose up -d mysql
   
   # Wait for MySQL to be ready (check logs)
   docker compose logs -f mysql
   ```

2. **Run Schema Scripts:**
   ```bash
   # Access MySQL container
   docker compose exec mysql bash
   
   # Inside container:
   mysql -u root -p${MYSQL_ROOT_PASSWORD} ${MYSQL_DATABASE}
   
   # Run your schema files
   source /docker-entrypoint-initdb.d/createtables.sql
   source /docker-entrypoint-initdb.d/insert.sql
   ```

### Manual Database Access

```bash
# Connect to MySQL from host
docker compose exec mysql mysql -u kandypack -p kandypackdb

# Or use external client
mysql -h localhost -P 3306 -u kandypack -p kandypackdb
```

### Database Backup

```bash
# Backup database
docker compose exec mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} kandypackdb > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker compose exec -T mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} kandypackdb < backup.sql
```

### Database Migrations

```bash
# Run stored procedures
docker compose exec backend python apply_stored_procedures.py

# Run additional data
docker compose exec backend python apply_additional_data.py
```

---

## 🌐 Production Deployment

### 1. Enable Nginx Reverse Proxy

```bash
# Start with nginx
docker compose --profile production up -d
```

### 2. SSL/TLS Certificates

#### Option A: Let's Encrypt (Recommended)

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/

# Update nginx.conf to enable HTTPS
```

#### Option B: Self-Signed (Development/Testing)

```bash
# Create directory
mkdir -p nginx/ssl

# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/privkey.pem \
  -out nginx/ssl/fullchain.pem \
  -subj "/CN=localhost"
```

### 3. Update Nginx Configuration

Edit `nginx/nginx.conf`:
1. Uncomment the HTTPS server block
2. Update `server_name` with your domain
3. Verify SSL certificate paths

### 4. Configure Domain & DNS

1. Point your domain's A record to your server's IP
2. Update `.env`:
   ```bash
   VITE_API_BASE_URL=https://yourdomain.com/api
   ```

### 5. Production Deployment Checklist

- [ ] Change all default passwords
- [ ] Set strong `SECRET_KEY`
- [ ] Enable SSL/TLS
- [ ] Set `DEBUG=false`
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure firewall (only 80, 443 open)
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Set up monitoring (optional)
- [ ] Enable rate limiting
- [ ] Review security settings

### 6. Deploy

```bash
# Pull latest code
git pull

# Rebuild images
docker compose build --no-cache

# Start with production profile
docker compose --profile production up -d

# Verify
docker compose ps
docker compose logs -f
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**

**Error:** `Bind for 0.0.0.0:3306 failed: port is already allocated`

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :3306
# or
netstat -tulpn | grep 3306

# Either stop the service or change port in .env
MYSQL_PORT=3307
```

#### 2. **MySQL Connection Failed**

**Error:** `Can't connect to MySQL server`

**Solution:**
```bash
# Check MySQL is running
docker compose ps mysql

# Check MySQL logs
docker compose logs mysql

# Wait for MySQL health check
docker compose exec mysql mysqladmin ping -h localhost -u root -p

# Verify credentials in .env
```

#### 3. **Backend Can't Connect to Database**

**Error:** `sqlalchemy.exc.OperationalError`

**Solution:**
```bash
# Ensure MySQL is healthy first
docker compose ps

# Check backend logs
docker compose logs backend

# Verify DATABASE_URL in backend container
docker compose exec backend env | grep DATABASE

# Restart backend after MySQL is ready
docker compose restart backend
```

#### 4. **Frontend Can't Reach Backend**

**Error:** `Network Error` or `CORS Error`

**Solution:**
```bash
# Check backend is running
docker compose ps backend

# Test backend API
curl http://localhost:8000/docs

# Verify VITE_API_BASE_URL in .env
# Make sure it's accessible from browser

# Check CORS settings in Backend/app/main.py
```

#### 5. **Build Fails**

**Error:** `failed to compute cache key`

**Solution:**
```bash
# Clean build cache
docker builder prune

# Remove all containers
docker compose down -v

# Rebuild without cache
docker compose build --no-cache
```

#### 6. **Container Keeps Restarting**

**Solution:**
```bash
# Check logs
docker compose logs <service-name>

# Check exit code
docker compose ps

# Run container interactively
docker compose run --rm backend bash
```

### Debug Commands

```bash
# Enter container shell
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec mysql bash

# Check container resource usage
docker stats

# Inspect container
docker compose inspect backend

# View container details
docker compose config

# Remove everything and start fresh
docker compose down -v
docker system prune -a
docker compose up -d --build
```

---

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check all services health
docker compose ps

# Backend API health
curl http://localhost:8000/docs

# Frontend health
curl http://localhost:3000

# MySQL health
docker compose exec mysql mysqladmin ping -h localhost -u root -p
```

### View Logs

```bash
# Real-time logs (all services)
docker compose logs -f

# Service-specific logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mysql

# Filter by time
docker compose logs --since 30m backend
docker compose logs --until 2023-01-01T12:00:00
```

### Resource Monitoring

```bash
# Container resource usage
docker stats

# Disk usage
docker system df

# Container inspect
docker compose exec backend df -h
```

### Automated Backups

Create a backup script `scripts/backup.sh`:

```bash
#!/bin/bash

# Backup directory
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker compose exec -T mysql mysqldump \
  -u root -p${MYSQL_ROOT_PASSWORD} \
  kandypackdb > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Delete backups older than 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

Add to crontab:
```bash
# Run daily at 2 AM
0 2 * * * /path/to/scripts/backup.sh
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose down
docker compose build --no-cache
docker compose up -d

# Verify
docker compose ps
```

### Clean Up

```bash
# Remove stopped containers
docker compose down

# Remove images
docker rmi kandypack-backend kandypack-frontend

# Clean system (⚠️ removes all unused data)
docker system prune -a

# Remove specific volume
docker volume rm kandypack-logistics-platform_mysql_data
```

---

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit `.env` file
- Use strong, unique passwords
- Rotate credentials regularly

### 2. Network Security

```bash
# Only expose necessary ports
# In production, use nginx reverse proxy
# Don't expose MySQL port externally
```

### 3. Container Security

```bash
# Run containers as non-root user
# Keep base images updated
# Scan images for vulnerabilities

docker scan kandypack-backend
```

### 4. Database Security

- Use strong passwords
- Enable SSL for MySQL connections
- Regular backups
- Limit database user permissions

### 5. Application Security

- Keep dependencies updated
- Enable HTTPS only
- Set secure headers
- Configure CORS properly
- Enable rate limiting

---

## 📞 Support & Resources

### Documentation

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)

### Useful Commands Reference

```bash
# Start everything
docker compose up -d

# Stop everything
docker compose down

# View logs
docker compose logs -f

# Restart service
docker compose restart backend

# Rebuild service
docker compose build backend

# Execute command in container
docker compose exec backend python script.py

# View running containers
docker compose ps

# Remove everything (including volumes)
docker compose down -v
```

---

## 📋 Quick Reference Card

```bash
# START APPLICATION
docker compose up -d

# VIEW LOGS
docker compose logs -f [service]

# STOP APPLICATION
docker compose down

# RESTART SERVICE
docker compose restart [service]

# REBUILD & RESTART
docker compose up -d --build [service]

# DATABASE BACKUP
docker compose exec mysql mysqldump -u root -p kandypackdb > backup.sql

# ACCESS CONTAINER
docker compose exec [service] bash

# VIEW STATUS
docker compose ps

# CLEAN UP
docker compose down -v
docker system prune -a
```

---

## 🎉 You're Ready!

Your KandyPack Logistics Platform is now containerized and ready for deployment!

**Next Steps:**
1. Review configuration in `.env`
2. Start services: `docker compose up -d`
3. Access application: http://localhost:3000
4. Check API docs: http://localhost:8000/docs
5. Set up backups and monitoring
6. Deploy to production server

**For Production:**
- Enable nginx reverse proxy
- Configure SSL/TLS certificates
- Set up domain and DNS
- Configure firewall
- Enable automated backups
- Set up monitoring

---

**Last Updated:** October 21, 2025  
**Version:** 1.0.0  
**Docker Compose Version:** 3.8

