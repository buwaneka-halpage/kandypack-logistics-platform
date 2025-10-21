#!/bin/bash

# KandyPack Database Restore Script
# Usage: ./scripts/restore.sh <backup_file>
# Example: ./scripts/restore.sh backups/db_backup_20231021_120000.sql.gz

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check arguments
if [ $# -eq 0 ]; then
    echo -e "${RED}Error: No backup file specified${NC}"
    echo "Usage: ./scripts/restore.sh <backup_file>"
    echo "Example: ./scripts/restore.sh backups/db_backup_20231021_120000.sql.gz"
    exit 1
fi

BACKUP_FILE=$1

# Check if file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}WARNING: Database Restore${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${RED}This will OVERWRITE the current database!${NC}"
echo -e "Backup file: $BACKUP_FILE"
echo -e "Database: ${MYSQL_DATABASE:-kandypackdb}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "Restore cancelled"
    exit 0
fi

# Check if MySQL container is running
if ! docker compose ps mysql | grep -q "Up"; then
    echo -e "${RED}Error: MySQL container is not running${NC}"
    exit 1
fi

echo -e "${GREEN}Starting restore...${NC}"

# Decompress if needed
TEMP_FILE="/tmp/restore_$(date +%s).sql"
if [[ $BACKUP_FILE == *.gz ]]; then
    echo "Decompressing backup..."
    gunzip -c $BACKUP_FILE > $TEMP_FILE
else
    cp $BACKUP_FILE $TEMP_FILE
fi

# Restore database
echo "Restoring database..."
docker compose exec -T mysql mysql \
    -u root \
    -p${MYSQL_ROOT_PASSWORD} \
    ${MYSQL_DATABASE:-kandypackdb} < $TEMP_FILE

# Clean up
rm $TEMP_FILE

echo -e "${GREEN}✓ Database restored successfully!${NC}"
echo -e "${YELLOW}Note: You may need to restart the backend:${NC}"
echo -e "${YELLOW}docker compose restart backend${NC}"

