"""
Test stored procedures directly
"""
import pymysql
from dotenv import load_dotenv
import os

load_dotenv()

DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DATABASE', 'kandypack_db'),
    'charset': 'utf8mb4'
}

print("Connecting to database...")
conn = pymysql.connect(**DB_CONFIG)
cursor = conn.cursor()
print("✓ Connected\n")

# Check if procedures exist
print("Checking stored procedures...")
cursor.execute("""
    SELECT ROUTINE_NAME 
    FROM INFORMATION_SCHEMA.ROUTINES 
    WHERE ROUTINE_SCHEMA = 'kandypack_db' 
    AND ROUTINE_TYPE = 'PROCEDURE'
    ORDER BY ROUTINE_NAME
""")
procs = cursor.fetchall()
print(f"Found {len(procs)} stored procedures:")
for proc in procs:
    print(f"  - {proc[0]}")

# Test calling sp_quarterly_sales
print("\nTesting sp_quarterly_sales...")
try:
    cursor.callproc("sp_quarterly_sales", (2025, 1))
    result = cursor.fetchall()
    print(f"✓ Success! Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test calling sp_top_items_by_quarter
print("\nTesting sp_top_items_by_quarter...")
try:
    cursor.callproc("sp_top_items_by_quarter", (2025, 1, 10))
    result = cursor.fetchall()
    print(f"✓ Success! Result: {result}")
except Exception as e:
    print(f"✗ Error: {e}")

cursor.close()
conn.close()
