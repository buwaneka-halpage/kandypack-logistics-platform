#!/bin/bash

# KandyPack Database Backup Script
# Usage: ./scripts/backup.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

echo -e "${GREEN}Starting database backup...${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Check if MySQL container is running
if ! docker compose ps mysql | grep -q "Up"; then
    echo -e "${RED}Error: MySQL container is not running${NC}"
    exit 1
fi

# Perform backup
echo "Creating backup: db_backup_$DATE.sql"
docker compose exec -T mysql mysqldump \
    -u root \
    -p${MYSQL_ROOT_PASSWORD} \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    ${MYSQL_DATABASE:-kandypackdb} > $BACKUP_DIR/db_backup_$DATE.sql

# Compress backup
echo "Compressing backup..."
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Calculate size
SIZE=$(du -h $BACKUP_DIR/db_backup_$DATE.sql.gz | cut -f1)
echo -e "${GREEN}Backup completed: db_backup_$DATE.sql.gz ($SIZE)${NC}"

# Clean old backups
echo "Cleaning backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# List recent backups
echo -e "\n${GREEN}Recent backups:${NC}"
ls -lh $BACKUP_DIR | tail -n 5

echo -e "\n${GREEN}✓ Backup completed successfully!${NC}"

