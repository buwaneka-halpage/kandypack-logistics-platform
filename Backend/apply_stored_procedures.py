"""
Apply stored procedures to the database
"""
import pymysql
from dotenv import load_dotenv
import os
from pathlib import Path

# Load environment variables
load_dotenv()

# Database connection parameters
DB_CONFIG = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DATABASE', 'kandypack_db'),
    'charset': 'utf8mb4'
}

# List of stored procedure files to apply
PROC_FILES = [
    'migrations/sql/procs/p_quarterly_sales.sql',
    'migrations/sql/procs/mostOrdeditems.sql',
    'migrations/sql/procs/citywisesales.sql',
    'migrations/sql/procs/Routewisesales.sql',
    'migrations/sql/procs/DriverWorkingHourReport.sql',
    'migrations/sql/procs/AssistantWorkingHourReport.sql',
    'migrations/sql/procs/TruckUsagePerMonth.sql',
    'migrations/sql/procs/customerOrderHistory.sql',
]

def execute_sql_file(cursor, filepath):
    """Execute SQL statements from a file"""
    print(f"Applying: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Remove delimiter commands and comments for MySQL execution
    sql_content = sql_content.replace('-- DELIMITER $$', '')
    sql_content = sql_content.replace('-- $$', '')
    sql_content = sql_content.replace('-- DELIMITER ;', '')
    
    # Split by semicolon but be careful with procedure bodies
    statements = []
    current_statement = []
    in_procedure = False
    
    for line in sql_content.split('\n'):
        line = line.strip()
        
        if line.startswith('CREATE PROCEDURE'):
            in_procedure = True
        
        if line:
            current_statement.append(line)
        
        if line.endswith(';'):
            if not in_procedure or (in_procedure and line == 'END;'):
                stmt = '\n'.join(current_statement)
                if stmt.strip():
                    statements.append(stmt)
                current_statement = []
                if in_procedure and line == 'END;':
                    in_procedure = False
    
    # Execute each statement
    for stmt in statements:
        if stmt.strip():
            try:
                cursor.execute(stmt)
                print(f"  ✓ Executed successfully")
            except Exception as e:
                print(f"  ✗ Error: {e}")
                raise

def main():
    print("=" * 60)
    print("Applying Stored Procedures to Database")
    print("=" * 60)
    print(f"\nDatabase: {DB_CONFIG['database']}@{DB_CONFIG['host']}")
    print(f"User: {DB_CONFIG['user']}")
    print()
    
    try:
        # Connect to database
        print("Connecting to database...")
        conn = pymysql.connect(**DB_CONFIG)
        cursor = conn.cursor()
        print("✓ Connected successfully\n")
        
        # Apply each stored procedure file
        success_count = 0
        error_count = 0
        
        for proc_file in PROC_FILES:
            filepath = Path(proc_file)
            if filepath.exists():
                try:
                    execute_sql_file(cursor, filepath)
                    conn.commit()
                    success_count += 1
                except Exception as e:
                    print(f"  ✗ Failed to apply {proc_file}: {e}")
                    conn.rollback()
                    error_count += 1
            else:
                print(f"✗ File not found: {proc_file}")
                error_count += 1
        
        # Close connection
        cursor.close()
        conn.close()
        
        # Summary
        print("\n" + "=" * 60)
        print("Summary")
        print("=" * 60)
        print(f"Successfully applied: {success_count} stored procedures")
        print(f"Errors: {error_count}")
        print()
        
        if error_count == 0:
            print("✓ All stored procedures applied successfully!")
        else:
            print("✗ Some stored procedures failed to apply")
            return 1
        
        return 0
        
    except pymysql.err.OperationalError as e:
        print(f"\n✗ Database connection error: {e}")
        print("\nPlease check your .env file and ensure:")
        print("  - DB_HOST is set correctly")
        print("  - DB_USER is set correctly")
        print("  - DB_PASSWORD is set correctly")
        print("  - DB_NAME is set correctly")
        print("  - MySQL server is running")
        return 1
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        return 1

if __name__ == "__main__":
    exit(main())
