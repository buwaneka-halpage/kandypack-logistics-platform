#!/usr/bin/env python3
"""
Apply additional schedules from SQL file to database
"""
import pymysql
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
conn = pymysql.connect(
    host=os.getenv('MYSQL_HOST', 'localhost'),
    port=int(os.getenv('MYSQL_PORT', 3306)),
    user=os.getenv('MYSQL_USER', 'root'),
    password=os.getenv('MYSQL_PASSWORD'),
    database=os.getenv('MYSQL_DATABASE', 'kandypack_db'),
    charset='utf8mb4'
)

try:
    # Read the SQL file
    sql_file_path = 'schemas/insert_additional_schedules.sql'
    with open(sql_file_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Remove comments and split by semicolon
    lines = [line for line in sql_content.split('\n') if line.strip() and not line.strip().startswith('--')]
    sql_clean = '\n'.join(lines)
    statements = [stmt.strip() for stmt in sql_clean.split(';') if stmt.strip()]
    
    cursor = conn.cursor()
    executed_count = 0
    for stmt in statements:
        if stmt:
            try:
                cursor.execute(stmt)
                executed_count += 1
                print(f"✓ Executed statement {executed_count}: {stmt[:80].replace(chr(10), ' ')}...")
            except pymysql.err.IntegrityError as e:
                print(f"⚠ Skipping (already exists): {stmt[:80].replace(chr(10), ' ')}...")
            except Exception as e:
                print(f"✗ Error: {e}")
                print(f"  Statement: {stmt[:150].replace(chr(10), ' ')}...")
    
    conn.commit()
    print("\n✅ Successfully applied additional schedules!")
    print(f"Total statements executed: {executed_count}")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    conn.rollback()
finally:
    conn.close()
