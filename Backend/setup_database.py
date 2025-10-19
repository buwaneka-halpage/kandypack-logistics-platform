"""
Database Setup Script for KandyPack Logistics Platform
This script creates the database, tables, and populates initial data
"""

import pymysql
from pymysql.cursors import DictCursor
import hashlib
import uuid
import re

import os
import getpass

# Database configuration (from database.py)
DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_PORT = int(os.getenv("MYSQL_PORT", 3306))
DB_USER = os.getenv("MYSQL_USER", "root")
# Prefer environment provided password, otherwise fallback to value from database.py
DB_PASSWORD = os.getenv("MYSQL_PASSWORD") or os.getenv("DB_PASSWORD") or "nilum@2002"
DB_NAME = os.getenv("MYSQL_DATABASE", "kandypack_db")

def get_connection(use_db=True):
    """Create database connection"""
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD if DB_PASSWORD != "" else None,
            database=DB_NAME if use_db else None,
            charset='utf8mb4',
            cursorclass=DictCursor
        )
        return connection
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None

def create_database():
    """Create database if it doesn't exist"""
    print("\n📦 Creating database...")
    conn = get_connection(use_db=False)
    # If initial connection failed due to access denied, prompt user for password and retry once
    if not conn:
        # If env vars didn't provide a working password, prompt interactively
        try:
            print("Initial connection failed. If you have MySQL root password, you can enter it now.")
            pwd = getpass.getpass(prompt="MySQL root password (leave blank for none): ")
            # overwrite global DB_PASSWORD for subsequent attempts
            global DB_PASSWORD
            DB_PASSWORD = pwd
            conn = get_connection(use_db=False)
            if not conn:
                print("Could not connect to MySQL with provided credentials.\nPlease verify MySQL is running and that the credentials are correct.\nYou can also set the MYSQL_PASSWORD environment variable and re-run this script.")
                return False
        except Exception as e:
            print("Error requesting password:", e)
            return False
    
    try:
        cursor = conn.cursor()
        cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME}")
        cursor.execute(f"CREATE DATABASE {DB_NAME}")
        print(f"✅ Database '{DB_NAME}' created successfully")
        return True
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False
    finally:
        conn.close()

def create_tables():
    """Create all tables"""
    print("\n🔨 Creating tables...")
    conn = get_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # Read and execute SQL file
        with open('schemas/createtables.sql', 'r', encoding='utf-8') as f:
            sql_script = f.read()
            
        # Split by semicolon and execute each statement
        statements = [stmt.strip() for stmt in sql_script.split(';') if stmt.strip()]
        
        for i, statement in enumerate(statements, 1):
            try:
                cursor.execute(statement)
                # Extract table name for better logging
                if 'CREATE TABLE' in statement.upper():
                    table_name = statement.split('CREATE TABLE')[1].split('(')[0].strip()
                    print(f"  ✓ Created table: {table_name}")
            except Exception as e:
                print(f"  ⚠ Statement {i} error: {e}")
        
        conn.commit()
        print("✅ All tables created successfully")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False
    finally:
        conn.close()

def hash_password(password: str) -> str:
    """Hash password using SHA256 (matching backend fallback)"""
    return hashlib.sha256(password.encode()).hexdigest()

def insert_sample_data():
    """Insert sample data for testing"""
    print("\n💾 Inserting sample data...")
    conn = get_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        
        # 1. Create Cities
        print("  → Creating cities...")
        cities = [
            (str(uuid.uuid4()), 'Colombo', 'Western'),
            (str(uuid.uuid4()), 'Kandy', 'Central'),
            (str(uuid.uuid4()), 'Galle', 'Southern'),
            (str(uuid.uuid4()), 'Jaffna', 'Northern'),
            (str(uuid.uuid4()), 'Negombo', 'Western'),
        ]
        cursor.executemany(
            "INSERT INTO cities (city_id, city_name, province) VALUES (%s, %s, %s)",
            cities
        )
        city_ids = {name: id for id, name, _ in cities}
        
        # 2. Create Railway Stations
        print("  → Creating railway stations...")
        stations = [
            (str(uuid.uuid4()), 'Colombo Fort', city_ids['Colombo']),
            (str(uuid.uuid4()), 'Kandy Railway Station', city_ids['Kandy']),
            (str(uuid.uuid4()), 'Galle Railway Station', city_ids['Galle']),
            (str(uuid.uuid4()), 'Jaffna Railway Station', city_ids['Jaffna']),
        ]
        cursor.executemany(
            "INSERT INTO railway_stations (station_id, station_name, city_id) VALUES (%s, %s, %s)",
            stations
        )
        station_ids = {name: id for id, name, _ in stations}
        
        # 3. Create Stores/Warehouses
        print("  → Creating warehouses...")
        stores = [
            (str(uuid.uuid4()), 'Colombo Main Warehouse', '0112345678', 'No 123, Galle Road, Colombo 03', 'John Silva', station_ids['Colombo Fort']),
            (str(uuid.uuid4()), 'Kandy Distribution Center', '0812345678', 'No 456, Peradeniya Road, Kandy', 'Mary Fernando', station_ids['Kandy Railway Station']),
            (str(uuid.uuid4()), 'Galle Warehouse', '0912345678', 'No 789, Matara Road, Galle', 'David Perera', station_ids['Galle Railway Station']),
            (str(uuid.uuid4()), 'Jaffna Warehouse', '0212345678', 'No 321, Point Pedro Road, Jaffna', 'Sarah Kumar', station_ids['Jaffna Railway Station']),
        ]
        cursor.executemany(
            "INSERT INTO stores (store_id, name, telephone_number, address, contact_person, station_id) VALUES (%s, %s, %s, %s, %s, %s)",
            stores
        )
        store_ids = {name: id for id, name, _, _, _, _ in stores}
        
        # 4. Create Users with warehouse assignments
        print("  → Creating users...")
        admin_password = hash_password('admin123')
        manager_password = hash_password('manager123')
        staff_password = hash_password('staff123')
        
        users = [
            # Management (no warehouse - sees all)
            (str(uuid.uuid4()), 'admin', admin_password, 'Management', None),
            (str(uuid.uuid4()), 'manager1', manager_password, 'Management', None),
            
            # System Admin (no warehouse - sees all)
            (str(uuid.uuid4()), 'sysadmin', admin_password, 'SystemAdmin', None),
            
            # Store Managers (assigned to specific warehouses)
            (str(uuid.uuid4()), 'colombo_manager', manager_password, 'StoreManager', store_ids['Colombo Main Warehouse']),
            (str(uuid.uuid4()), 'kandy_manager', manager_password, 'StoreManager', store_ids['Kandy Distribution Center']),
            (str(uuid.uuid4()), 'galle_manager', manager_password, 'StoreManager', store_ids['Galle Warehouse']),
            
            # Warehouse Staff (assigned to specific warehouses)
            (str(uuid.uuid4()), 'colombo_staff1', staff_password, 'WarehouseStaff', store_ids['Colombo Main Warehouse']),
            (str(uuid.uuid4()), 'colombo_staff2', staff_password, 'WarehouseStaff', store_ids['Colombo Main Warehouse']),
            (str(uuid.uuid4()), 'kandy_staff', staff_password, 'WarehouseStaff', store_ids['Kandy Distribution Center']),
            
            # Driver Assistant (assigned to warehouse)
            (str(uuid.uuid4()), 'colombo_assistant', staff_password, 'DriverAssistant', store_ids['Colombo Main Warehouse']),
        ]
        
        # First, let's add warehouse_id column to users table
        try:
            cursor.execute("ALTER TABLE users ADD COLUMN warehouse_id CHAR(36) NULL")
            cursor.execute("ALTER TABLE users ADD CONSTRAINT fk_users_warehouse FOREIGN KEY (warehouse_id) REFERENCES stores(store_id)")
            print("  ✓ Added warehouse_id column to users table")
        except:
            pass  # Column might already exist
        
        cursor.executemany(
            "INSERT INTO users (user_id, user_name, password_hash, role, warehouse_id) VALUES (%s, %s, %s, %s, %s)",
            users
        )
        
        # 5. Create Customers
        print("  → Creating customers...")
        customer_password = hash_password('customer123')
        customers = [
            (str(uuid.uuid4()), 'customer1', 'Rajesh Kumar', '+94771234567', 'No 45, Galle Road, Colombo 04', customer_password),
            (str(uuid.uuid4()), 'customer2', 'Priya Silva', '+94771234568', 'No 23, Main Street, Kandy', customer_password),
            (str(uuid.uuid4()), 'customer3', 'Amal Perera', '+94771234569', 'No 67, Beach Road, Galle', customer_password),
        ]
        
        # Add customer_user_name and password_hash to customers table if not exists
        try:
            cursor.execute("ALTER TABLE customers ADD COLUMN customer_user_name VARCHAR(50) UNIQUE NULL")
            cursor.execute("ALTER TABLE customers ADD COLUMN password_hash VARCHAR(255) NULL")
            print("  ✓ Added customer_user_name and password_hash columns to customers table")
        except:
            pass
        
        cursor.executemany(
            "INSERT INTO customers (customer_id, customer_user_name, customer_name, phone_number, address, password_hash) VALUES (%s, %s, %s, %s, %s, %s)",
            customers
        )
        customer_ids = [id for id, _, _, _, _, _ in customers]
        
        # 6. Create Products
        print("  → Creating products...")
        products = [
            (str(uuid.uuid4()), 'Electronics Box (Small)', 2.5),
            (str(uuid.uuid4()), 'Electronics Box (Large)', 5.0),
            (str(uuid.uuid4()), 'Clothing Package', 1.5),
            (str(uuid.uuid4()), 'Food Items', 3.0),
            (str(uuid.uuid4()), 'Books & Documents', 1.0),
        ]
        cursor.executemany(
            "INSERT INTO products (product_type_id, product_name, space_consumption_rate) VALUES (%s, %s, %s)",
            products
        )
        product_ids = [id for id, _, _ in products]
        
    # 7. Create Sample Orders (some unassigned for testing assignment)
        print("  → Creating sample orders...")
        
        # Add warehouse_id to orders table
        try:
            cursor.execute("ALTER TABLE orders ADD COLUMN warehouse_id CHAR(36) NULL")
            cursor.execute("ALTER TABLE orders ADD CONSTRAINT fk_orders_warehouse FOREIGN KEY (warehouse_id) REFERENCES stores(store_id)")
            print("  ✓ Added warehouse_id column to orders table")
        except:
            pass
        
        # Ensure enum contains expected statuses used by sample data
        def ensure_enum_contains(cursor, table, column, value, default='PLACED'):
            """Ensure the ENUM column contains the given value; if not, alter the column to add it."""
            try:
                cursor.execute(f"SHOW COLUMNS FROM {table} LIKE '{column}'")
                col = cursor.fetchone()
                if not col:
                    return
                coltype = col['Type']  # e.g. enum('A','B')
                if f"'{value}'" in coltype:
                    return
                # extract existing enum values
                items = re.findall(r"'([^']*)'", coltype)
                if value in items:
                    return
                items.append(value)
                new_enum = ",".join(f"'{v}'" for v in items)
                cursor.execute(f"ALTER TABLE {table} MODIFY {column} ENUM({new_enum}) NOT NULL DEFAULT '{default}'")
                print(f"  ✓ Added '{value}' to {table}.{column} enum")
            except Exception:
                pass

        # Make sure 'IN_WAREHOUSE' is allowed by the orders.status enum
        try:
            ensure_enum_contains(cursor, 'orders', 'status', 'IN_WAREHOUSE')
        except Exception:
            pass

        # Unassigned orders (for Management to assign)
        unassigned_orders = [
            (str(uuid.uuid4()), customer_ids[0], 'No 45, Galle Road, Colombo 04', 'PLACED', city_ids['Colombo'], 15000.00, None),
            (str(uuid.uuid4()), customer_ids[1], 'No 23, Main Street, Kandy', 'PLACED', city_ids['Kandy'], 25000.00, None),
            (str(uuid.uuid4()), customer_ids[2], 'No 67, Beach Road, Galle', 'PLACED', city_ids['Galle'], 18000.00, None),
        ]
        
        # Assigned orders (already assigned to warehouses)
        assigned_orders = [
            (str(uuid.uuid4()), customer_ids[0], 'No 45, Galle Road, Colombo 04', 'IN_WAREHOUSE', city_ids['Colombo'], 22000.00, store_ids['Colombo Main Warehouse']),
            (str(uuid.uuid4()), customer_ids[1], 'No 23, Main Street, Kandy', 'IN_WAREHOUSE', city_ids['Kandy'], 30000.00, store_ids['Kandy Distribution Center']),
            (str(uuid.uuid4()), customer_ids[2], 'No 67, Beach Road, Galle', 'COMPLETED', city_ids['Galle'], 12000.00, store_ids['Galle Warehouse']),
        ]
        
        all_orders = unassigned_orders + assigned_orders
        cursor.executemany(
            "INSERT INTO orders (order_id, customer_id, deliver_address, status, deliver_city_id, full_price, warehouse_id) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            all_orders
        )
        
        conn.commit()
        
        # Print summary
        print("\n✅ Sample data inserted successfully!")
        print("\n📊 Summary:")
        print(f"  • Cities: {len(cities)}")
        print(f"  • Railway Stations: {len(stations)}")
        print(f"  • Warehouses: {len(stores)}")
        print(f"  • Users: {len(users)}")
        print(f"  • Customers: {len(customers)}")
        print(f"  • Products: {len(products)}")
        print(f"  • Orders: {len(all_orders)} ({len(unassigned_orders)} unassigned, {len(assigned_orders)} assigned)")
        
        print("\n🔐 Test Credentials:")
        print("  Management:")
        print("    • Username: admin | Password: admin123")
        print("    • Username: manager1 | Password: admin123")
        print("  System Admin:")
        print("    • Username: sysadmin | Password: admin123")
        print("  Store Managers:")
        print("    • Username: colombo_manager | Password: manager123 (Colombo Warehouse)")
        print("    • Username: kandy_manager | Password: manager123 (Kandy Warehouse)")
        print("    • Username: galle_manager | Password: manager123 (Galle Warehouse)")
        print("  Warehouse Staff:")
        print("    • Username: colombo_staff1 | Password: staff123 (Colombo)")
        print("    • Username: kandy_staff | Password: staff123 (Kandy)")
        print("  Customers:")
        print("    • Username: customer1 | Password: customer123")
        print("    • Username: customer2 | Password: customer123")
        
        return True
    except Exception as e:
        print(f"❌ Error inserting data: {e}")
        import traceback
        traceback.print_exc()
        return False
    finally:
        conn.close()

def main():
    """Main setup function"""
    print("=" * 60)
    print("🚀 KandyPack Database Setup")
    print("=" * 60)
    
    # Step 1: Create database
    if not create_database():
        print("\n❌ Setup failed at database creation")
        return
    
    # Step 2: Create tables
    if not create_tables():
        print("\n❌ Setup failed at table creation")
        return
    
    # Step 3: Insert sample data
    if not insert_sample_data():
        print("\n❌ Setup failed at data insertion")
        return
    
    print("\n" + "=" * 60)
    print("✅ Database setup completed successfully!")
    print("=" * 60)
    print("\n🎯 Next steps:")
    print("  1. Start the backend server: uvicorn app.main:app --reload")
    print("  2. Test the API at: http://localhost:8000")
    print("  3. Try logging in with the test credentials above")
    print("=" * 60)

if __name__ == "__main__":
    main()
