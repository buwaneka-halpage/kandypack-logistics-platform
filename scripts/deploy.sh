#!/bin/bash

# KandyPack Logistics Platform - Deployment Script
# Usage: ./scripts/deploy.sh [environment]
# Example: ./scripts/deploy.sh production

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Environment (default: production)
ENVIRONMENT=${1:-production}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}KandyPack Deployment Script${NC}"
echo -e "${GREEN}Environment: $ENVIRONMENT${NC}"
echo -e "${GREEN}========================================${NC}"

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Warning: .env file not found${NC}"
    echo -e "${YELLOW}Copying from .env-template...${NC}"
    
    if [ -f .env-template ]; then
        cp .env-template .env
        echo -e "${YELLOW}Please edit .env file with your configuration${NC}"
        exit 1
    else
        echo -e "${RED}Error: Neither .env nor .env-template found${NC}"
        exit 1
    fi
fi

# Pull latest code (if git repo)
if [ -d .git ]; then
    echo -e "${GREEN}[1/6] Pulling latest code...${NC}"
    git pull
else
    echo -e "${YELLOW}[1/6] Skipping git pull (not a git repository)${NC}"
fi

# Backup database
echo -e "${GREEN}[2/6] Creating database backup...${NC}"
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

if docker compose ps mysql | grep -q "Up"; then
    docker compose exec -T mysql mysqldump -u root -p${MYSQL_ROOT_PASSWORD} \
        ${MYSQL_DATABASE:-kandypackdb} > $BACKUP_DIR/db_backup_$DATE.sql 2>/dev/null || true
    
    if [ -f "$BACKUP_DIR/db_backup_$DATE.sql" ]; then
        gzip $BACKUP_DIR/db_backup_$DATE.sql
        echo -e "${GREEN}Backup created: db_backup_$DATE.sql.gz${NC}"
    fi
else
    echo -e "${YELLOW}MySQL not running, skipping backup${NC}"
fi

# Stop existing containers
echo -e "${GREEN}[3/6] Stopping existing containers...${NC}"
docker compose down

# Build images
echo -e "${GREEN}[4/6] Building Docker images...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    docker compose build --no-cache
else
    docker compose -f docker-compose.dev.yml build
fi

# Start containers
echo -e "${GREEN}[5/6] Starting containers...${NC}"
if [ "$ENVIRONMENT" == "production" ]; then
    docker compose up -d --remove-orphans
else
    docker compose -f docker-compose.dev.yml up -d --remove-orphans
fi

# Wait for services to be healthy
echo -e "${GREEN}[6/6] Waiting for services to be ready...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

# Wait for MySQL
echo -n "Waiting for MySQL"
for i in {1..60}; do
    if docker compose exec mysql mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD} &> /dev/null; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for Backend
echo -n "Waiting for Backend"
for i in {1..60}; do
    if curl -s http://localhost:${BACKEND_PORT:-8000}/docs &> /dev/null; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Wait for Frontend
echo -n "Waiting for Frontend"
for i in {1..60}; do
    if curl -s http://localhost:${FRONTEND_PORT:-3000} &> /dev/null; then
        echo -e " ${GREEN}✓${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# Show status
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment Status${NC}"
echo -e "${GREEN}========================================${NC}"
docker compose ps

# Show access URLs
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Access URLs${NC}"
echo -e "${GREEN}========================================${NC}"
echo -e "Frontend:  ${YELLOW}http://localhost:${FRONTEND_PORT:-3000}${NC}"
echo -e "Backend:   ${YELLOW}http://localhost:${BACKEND_PORT:-8000}${NC}"
echo -e "API Docs:  ${YELLOW}http://localhost:${BACKEND_PORT:-8000}/docs${NC}"
echo -e "Database:  ${YELLOW}localhost:${MYSQL_PORT:-3306}${NC}"

# Show logs option
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}View Logs:${NC}"
echo -e "${YELLOW}docker compose logs -f${NC}"
echo -e "${GREEN}========================================${NC}"

# Final success message
echo -e "\n${GREEN}✓ Deployment completed successfully!${NC}\n"

