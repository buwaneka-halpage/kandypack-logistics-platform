"""
Generate password hashes for test users and update database
"""
import pymysql
import os
from dotenv import load_dotenv
from passlib.context import CryptContext

# Load environment variables
load_dotenv()

DB_HOST = os.getenv("MYSQL_HOST", "localhost")
DB_USER = os.getenv("MYSQL_USER", "root")
DB_PASSWORD = os.getenv("MYSQL_PASSWORD")
DB_NAME = os.getenv("MYSQL_DATABASE", "kandypack_db")

# Password hashing setup (same as backend)
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a password using pbkdf2_sha256"""
    return pwd_context.hash(password)

def update_passwords():
    """Update all user passwords with properly hashed versions"""
    
    print("🔐 Generating password hashes and updating database...")
    
    # Define test passwords
    test_password = "password123"
    
    # Generate hashes
    hashed_password = hash_password(test_password)
    
    print(f"\n✅ Generated hash for 'password123':")
    print(f"   {hashed_password[:50]}...")
    
    try:
        # Connect to database
        connection = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,
            charset='utf8mb4'
        )
        
        with connection.cursor() as cursor:
            # Update all users to use the same test password
            print("\n📝 Updating user passwords...")
            cursor.execute("""
                UPDATE users 
                SET password_hash = %s
            """, (hashed_password,))
            
            affected = cursor.rowcount
            connection.commit()
            
            print(f"✅ Updated {affected} user passwords")
            
            # Update all customers to use the same test password
            print("\n📝 Updating customer passwords...")
            cursor.execute("""
                UPDATE customers 
                SET password_hash = %s
            """, (hashed_password,))
            
            affected = cursor.rowcount
            connection.commit()
            
            print(f"✅ Updated {affected} customer passwords")
            
            # Display users
            print("\n📊 Current users:")
            cursor.execute("SELECT user_id, user_name, role FROM users")
            users = cursor.fetchall()
            for user in users:
                print(f"   - {user[1]} ({user[2]})")
        
        connection.close()
        
        print("\n✅ All passwords updated successfully!")
        print(f"\n🔑 Test credentials:")
        print(f"   Username: store_manager1 (or any other username)")
        print(f"   Password: password123")
        
    except Exception as e:
        print(f"\n❌ Error updating passwords: {e}")
        raise

if __name__ == "__main__":
    update_passwords()
