"""
Script to reset the database - drop all tables, recreate them, and populate with data.
This ensures the database schema matches the SQLAlchemy models exactly.
"""

import pymysql
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", os.getenv("DB_HOST", "localhost"))
DB_USER = os.getenv("MYSQL_USER", os.getenv("DB_USER", "root"))
DB_PASSWORD = os.getenv("MYSQL_PASSWORD", os.getenv("DB_PASSWORD"))
DB_NAME = os.getenv("MYSQL_DATABASE", os.getenv("DB_NAME", "kandypack_db"))

# Password hashing setup (same as backend)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using pbkdf2_sha256"""
    return pwd_context.hash(password)

def reset_database():
    """Drop and recreate all tables, then populate with initial data"""
    
    print(f"🔄 Connecting to MySQL database '{DB_NAME}'...")
    
    try:
        # Connect to MySQL
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            print("\n🗑️  Dropping all existing tables...")
            
            # Disable foreign key checks to drop tables in any order
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            
            # Get all tables
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            
            # Drop each table
            for table in tables:
                table_name = table[f'Tables_in_{DB_NAME}']
                print(f"   Dropping table: {table_name}")
                cursor.execute(f"DROP TABLE IF EXISTS `{table_name}`;")
            
            # Re-enable foreign key checks
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            connection.commit()
            
            print("\n✅ All tables dropped successfully!")
            
            print("\n🏗️  Creating tables from schema...")
            
            # Read and execute create tables SQL
            with open('schemas/createtables.sql', 'r', encoding='utf-8') as f:
                create_sql = f.read()
                
                # Split by semicolon and execute each statement
                statements = [stmt.strip() for stmt in create_sql.split(';') if stmt.strip()]
                
                for stmt in statements:
                    if stmt:
                        try:
                            cursor.execute(stmt)
                            connection.commit()
                        except Exception as e:
                            print(f"   ⚠️  Warning executing statement: {e}")
                            print(f"   Statement: {stmt[:100]}...")
            
            print("✅ Tables created successfully!")
            
            print("\n📊 Inserting initial data...")
            
            # Read and execute insert SQL
            with open('schemas/insert.sql', 'r', encoding='utf-8') as f:
                insert_sql = f.read()
                
                # Remove comments
                lines = []
                for line in insert_sql.split('\n'):
                    line = line.strip()
                    if line and not line.startswith('--'):
                        lines.append(line)
                
                clean_sql = ' '.join(lines)
                
                # Split by semicolon
                statements = [stmt.strip() for stmt in clean_sql.split(';') if stmt.strip()]
                
                inserted = 0
                for stmt in statements:
                    if stmt and 'INSERT' in stmt.upper():
                        try:
                            cursor.execute(stmt)
                            connection.commit()
                            inserted += 1
                        except pymysql.err.IntegrityError as e:
                            print(f"   ⚠️  Skipping (already exists): {str(e)[:80]}...")
                        except Exception as e:
                            print(f"   ❌ Error: {e}")
                            print(f"   Statement: {stmt[:150]}...")
            
            print(f"✅ Inserted {inserted} records successfully!")
            
            print("\n� Hashing passwords...")
            
            # Hash all user passwords (replace fake hashes with real ones)
            test_password = "password123"
            hashed_password = hash_password(test_password)
            
            # Update users table
            cursor.execute("UPDATE users SET password_hash = %s", (hashed_password,))
            users_updated = cursor.rowcount
            
            # Update customers table
            cursor.execute("UPDATE customers SET password_hash = %s", (hashed_password,))
            customers_updated = cursor.rowcount
            
            connection.commit()
            print(f"✅ Hashed {users_updated} user passwords and {customers_updated} customer passwords")
            
            print("\n�📈 Adding additional schedule data...")
            
            # Read and execute additional data
            try:
                with open('schemas/insert_additional_schedules.sql', 'r', encoding='utf-8') as f:
                    additional_sql = f.read()
                    
                    # Remove comments
                    lines = []
                    for line in additional_sql.split('\n'):
                        line = line.strip()
                        if line and not line.startswith('--'):
                            lines.append(line)
                    
                    clean_sql = ' '.join(lines)
                    
                    # Split by semicolon
                    statements = [stmt.strip() for stmt in clean_sql.split(';') if stmt.strip()]
                    
                    added = 0
                    for stmt in statements:
                        if stmt and 'INSERT' in stmt.upper():
                            try:
                                cursor.execute(stmt)
                                connection.commit()
                                added += 1
                            except pymysql.err.IntegrityError as e:
                                print(f"   ⚠️  Skipping (duplicate): {str(e)[:60]}...")
                            except Exception as e:
                                print(f"   ❌ Error: {e}")
                
                print(f"✅ Added {added} additional records!")
            except FileNotFoundError:
                print("   ℹ️  No additional data file found, skipping...")
            
            print("\n📊 Database Statistics:")
            
            # Count records in each table
            cursor.execute("SHOW TABLES;")
            tables = cursor.fetchall()
            
            for table in tables:
                table_name = table[f'Tables_in_{DB_NAME}']
                cursor.execute(f"SELECT COUNT(*) as count FROM `{table_name}`;")
                count = cursor.fetchone()['count']
                print(f"   {table_name}: {count} records")
        
        connection.close()
        print("\n✅ Database reset completed successfully!")
        print(f"\n🎉 Your database '{DB_NAME}' is now ready to use!")
        
        print("\n" + "="*60)
        print("🔑 TEST CREDENTIALS")
        print("="*60)
        print("\n👥 All users (21 total) use password: password123")
        print("\nUser Roles:")
        print("  • SystemAdmin: admin, sysadmin")
        print("  • StoreManager: store_manager1, store_manager2, store_manager3")
        print("  • WarehouseStaff: warehouse_staff1, warehouse_staff2, warehouse_staff3")
        print("  • Management: management1, management2, management3")
        print("  • Driver: driver1, driver2, driver3, driver4, driver5")
        print("  • Assistant: assistant1, assistant2, assistant3, assistant4, assistant5")
        print("\n👤 Customers (3 total) also use password: password123")
        print("  • john_perera, ama_silva, kamal_fernando")
        print("="*60)
        
    except Exception as e:
        print(f"\n❌ Error resetting database: {e}")
        raise

if __name__ == "__main__":
    print("="*60)
    print("🔄 KANDYPACK DATABASE RESET SCRIPT")
    print("="*60)
    print("\n⚠️  WARNING: This will DELETE ALL DATA in the database!")
    print(f"   Database: {DB_NAME}")
    print(f"   Host: {DB_HOST}")
    print(f"   User: {DB_USER}")
    
    response = input("\n❓ Are you sure you want to continue? (yes/no): ")
    
    if response.lower() in ['yes', 'y']:
        reset_database()
    else:
        print("\n❌ Database reset cancelled.")
