# 🐳 KandyPack Logistics Platform - Docker Setup

**Complete containerized deployment for Backend, Frontend, and MySQL Database**

---

## 📦 What's Included

Your application is now fully containerized with:

- ✅ **Backend (FastAPI)** - Python 3.11, auto-reload
- ✅ **Frontend (React)** - Node 20, optimized build
- ✅ **MySQL Database** - MySQL 8.0, persistent storage
- ✅ **Nginx Reverse Proxy** - Production-ready with SSL support
- ✅ **Health Checks** - All services monitored
- ✅ **Hot Reload** - Development mode with code changes
- ✅ **Automated Backups** - Database backup scripts
- ✅ **Deployment Scripts** - One-command deployment

---

## 🗂️ File Structure

```
kandypack-logistics-platform/
├── Backend/
│   ├── Dockerfile              ✅ Backend container
│   └── .dockerignore          ✅ Exclude unnecessary files
├── frontend/UI/
│   ├── Dockerfile              ✅ Frontend container
│   └── .dockerignore          ✅ Exclude node_modules
├── nginx/
│   └── nginx.conf             ✅ Reverse proxy config
├── scripts/
│   ├── deploy.sh              ✅ Automated deployment
│   ├── backup.sh              ✅ Database backup
│   └── restore.sh             ✅ Database restore
├── docker-compose.yml         ✅ Production config
├── docker-compose.dev.yml     ✅ Development config
├── .env-template              ✅ Environment variables template
├── DOCKER_DEPLOYMENT_GUIDE.md ✅ Full documentation
├── DOCKER_QUICK_START.md      ✅ Quick reference
└── README_DOCKER.md           ✅ This file
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Docker

**Windows/Mac:** Download [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### 2. Setup Environment

```bash
# Copy environment template
cp .env-template .env

# Edit with your settings (IMPORTANT!)
notepad .env  # Windows
nano .env     # Linux/Mac
```

**Must change these:**
```bash
MYSQL_ROOT_PASSWORD=your_strong_password
MYSQL_PASSWORD=your_strong_password
SECRET_KEY=$(openssl rand -hex 32)  # Generate secure key
```

### 3. Start Application

```bash
# Build and start everything
docker compose up -d

# Watch logs
docker compose logs -f
```

### 4. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/docs
- **Database:** localhost:3306

**Wait 2-3 minutes for first startup!**

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **DOCKER_QUICK_START.md** | 5-minute setup guide |
| **DOCKER_DEPLOYMENT_GUIDE.md** | Complete production deployment |
| **README_DOCKER.md** | This overview file |

---

## 🎯 Common Commands

### Development

```bash
# Start development environment (with hot-reload)
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose logs -f [backend|frontend|mysql]

# Restart service
docker compose restart backend

# Stop everything
docker compose down
```

### Production

```bash
# Deploy with automated script
./scripts/deploy.sh production

# Or manually
docker compose up -d --build

# With nginx reverse proxy
docker compose --profile production up -d
```

### Database

```bash
# Backup database
./scripts/backup.sh

# Restore database
./scripts/restore.sh backups/db_backup_YYYYMMDD_HHMMSS.sql.gz

# Access MySQL directly
docker compose exec mysql mysql -u root -p
```

### Maintenance

```bash
# View running containers
docker compose ps

# Check resource usage
docker stats

# Clean up old images
docker system prune -a

# Rebuild specific service
docker compose build backend
docker compose up -d backend
```

---

## 🔄 Development vs Production

### Development Mode (`docker-compose.dev.yml`)

**Features:**
- ✅ Hot-reload for code changes
- ✅ Source code mounted as volumes
- ✅ Debug mode enabled
- ✅ Development database
- ✅ Detailed logs

**Start:**
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Production Mode (`docker-compose.yml`)

**Features:**
- ✅ Optimized builds
- ✅ Multi-stage Docker builds
- ✅ Health checks enabled
- ✅ Nginx reverse proxy
- ✅ SSL/TLS support
- ✅ Persistent volumes

**Start:**
```bash
docker compose up -d
# or
./scripts/deploy.sh production
```

---

## 🌐 Production Deployment

### Pre-Deployment Checklist

- [ ] Domain registered and DNS configured
- [ ] SSL certificates obtained (Let's Encrypt recommended)
- [ ] `.env` file configured with production values
- [ ] Strong passwords for all services
- [ ] `SECRET_KEY` generated (32+ characters)
- [ ] `DEBUG=false` in `.env`
- [ ] Firewall configured (ports 80, 443 only)
- [ ] Backup strategy in place

### Deployment Steps

1. **Prepare Server**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   
   # Install Docker Compose
   sudo apt install docker-compose-plugin
   ```

2. **Clone Repository**
   ```bash
   git clone <your-repo-url>
   cd kandypack-logistics-platform
   ```

3. **Configure Environment**
   ```bash
   cp .env-template .env
   nano .env
   ```

4. **Setup SSL Certificates**
   ```bash
   # Install Certbot
   sudo apt install certbot
   
   # Generate certificates
   sudo certbot certonly --standalone -d yourdomain.com
   
   # Copy to nginx directory
   mkdir -p nginx/ssl
   sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
   sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
   ```

5. **Deploy**
   ```bash
   # Make scripts executable (Linux/Mac)
   chmod +x scripts/*.sh
   
   # Deploy
   ./scripts/deploy.sh production
   ```

6. **Verify Deployment**
   ```bash
   docker compose ps
   docker compose logs -f
   ```

### Post-Deployment

1. **Setup Automated Backups**
   ```bash
   # Add to crontab (daily at 2 AM)
   crontab -e
   # Add: 0 2 * * * /path/to/kandypack/scripts/backup.sh
   ```

2. **Configure Firewall**
   ```bash
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **Monitor Services**
   ```bash
   # Check health
   curl https://yourdomain.com
   curl https://yourdomain.com/api/docs
   
   # Monitor logs
   docker compose logs -f
   ```

---

## 🔧 Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs [service_name]

# Check if port is in use
netstat -tulpn | grep [port]

# Restart service
docker compose restart [service_name]
```

### Database Connection Failed

```bash
# Check MySQL is running
docker compose ps mysql

# Wait for MySQL to be ready
docker compose logs mysql | grep "ready for connections"

# Test connection
docker compose exec mysql mysql -u root -p
```

### Frontend Can't Reach Backend

```bash
# Verify VITE_API_BASE_URL in .env
# Should be: http://localhost:8000 (dev) or https://yourdomain.com/api (prod)

# Check backend is accessible
curl http://localhost:8000/docs
```

### Permission Denied

```bash
# Linux/Mac: Make scripts executable
chmod +x scripts/*.sh

# Docker permission denied
sudo usermod -aG docker $USER
newgrp docker
```

### Out of Disk Space

```bash
# Clean Docker cache
docker system prune -a

# Remove old backups
rm backups/db_backup_*.sql.gz
```

---

## 📊 Monitoring

### Health Checks

All services have health checks:
```bash
docker compose ps
```

### Resource Usage

```bash
# View resource consumption
docker stats

# Check container details
docker compose exec backend df -h
```

### Logs

```bash
# Real-time logs
docker compose logs -f

# Last 100 lines
docker compose logs --tail=100

# Specific service
docker compose logs -f backend

# Time-filtered
docker compose logs --since 30m backend
```

---

## 🔒 Security Best Practices

1. **Change All Default Passwords**
   - MySQL root password
   - MySQL user password
   - JWT secret key

2. **Use Strong Passwords**
   ```bash
   # Generate secure password
   openssl rand -base64 32
   
   # Generate JWT secret
   openssl rand -hex 32
   ```

3. **Enable HTTPS in Production**
   - Use Let's Encrypt certificates
   - Update nginx.conf to enable SSL
   - Redirect HTTP to HTTPS

4. **Configure Firewall**
   - Only expose ports 80 and 443
   - Block direct database access from internet

5. **Regular Updates**
   ```bash
   # Update base images
   docker compose pull
   docker compose up -d --build
   ```

6. **Regular Backups**
   - Automated daily backups
   - Store backups off-site
   - Test restore procedure

---

## 🆘 Getting Help

### Check Documentation

1. **Quick Start:** `DOCKER_QUICK_START.md`
2. **Full Guide:** `DOCKER_DEPLOYMENT_GUIDE.md`
3. **This README:** `README_DOCKER.md`

### Debug Commands

```bash
# Enter container shell
docker compose exec backend bash
docker compose exec frontend sh
docker compose exec mysql bash

# Check container status
docker compose ps

# View detailed container info
docker inspect kandypack-backend

# Check network connectivity
docker compose exec backend ping mysql
```

### Common Solutions

| Problem | Solution |
|---------|----------|
| Port in use | Change port in `.env` file |
| Can't connect to DB | Wait for MySQL health check, then restart backend |
| Build fails | Run `docker compose build --no-cache` |
| Container crashes | Check logs: `docker compose logs [service]` |
| Out of disk | Run `docker system prune -a` |

---

## 📈 Scaling

### Horizontal Scaling

```yaml
# In docker-compose.yml
services:
  backend:
    deploy:
      replicas: 3
```

### Load Balancing

Configure nginx to load balance across multiple backend instances.

### Database Clustering

For high availability, consider MySQL replication or clustering.

---

## 🎉 You're Ready!

Your KandyPack Logistics Platform is now fully containerized!

**Next Steps:**

1. ✅ Review `.env` configuration
2. ✅ Start services: `docker compose up -d`
3. ✅ Access application: http://localhost:3000
4. ✅ Check API docs: http://localhost:8000/docs
5. ✅ Set up automated backups
6. ✅ Configure production deployment

---

## 📝 Quick Command Reference

```bash
# START
docker compose up -d

# STOP
docker compose down

# LOGS
docker compose logs -f

# RESTART
docker compose restart [service]

# REBUILD
docker compose build [service]

# BACKUP
./scripts/backup.sh

# DEPLOY
./scripts/deploy.sh production

# STATUS
docker compose ps
```

---

**Documentation Version:** 1.0.0  
**Last Updated:** October 21, 2025  
**Docker Compose Version:** 3.8

**For detailed instructions, see `DOCKER_DEPLOYMENT_GUIDE.md`**

