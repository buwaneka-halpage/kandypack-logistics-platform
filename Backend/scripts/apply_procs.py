#!/usr/bin/env python3
"""
Idempotent runner for SQL procedure files.
Usage:
  python scripts\\apply_procs.py
(Loads DB credentials from .env file)
"""

import os
import sys
import hashlib
import argparse
from datetime import datetime
import pymysql
from dotenv import load_dotenv

# Get the Backend directory path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
PROCS_DIR = os.path.join(BACKEND_DIR, "migrations", "sql", "procs")
BOOKKEEP_TABLE = "proc_migrations"

def sha256_of_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()

def ensure_bookkeeping(conn):
    with conn.cursor() as cur:
        cur.execute(f"""
        CREATE TABLE IF NOT EXISTS {BOOKKEEP_TABLE} (
            filename VARCHAR(255) PRIMARY KEY,
            checksum VARCHAR(64) NOT NULL,
            applied_at DATETIME NOT NULL
        ) ENGINE=InnoDB;
        """)
    conn.commit()

def get_applied_checksums(conn):
    with conn.cursor() as cur:
        cur.execute(f"SELECT filename, checksum FROM {BOOKKEEP_TABLE}")
        return {row[0]: row[1] for row in cur.fetchall()}

def record_applied(conn, filename, checksum):
    now = datetime.now()
    with conn.cursor() as cur:
        cur.execute(f"""
        INSERT INTO {BOOKKEEP_TABLE} (filename, checksum, applied_at)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE checksum=%s, applied_at=%s
        """, (filename, checksum, now, checksum, now))
    conn.commit()

def execute_file_with_mysql_cli(mysql_path, host, user, password, db, filepath):
    """
    Execute SQL file directly using pymysql instead of mysql CLI.
    This works cross-platform without requiring mysql client to be installed.
    """
    # Read the SQL file
    with open(filepath, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Remove delimiter commands and comments that are mysql-cli specific
    lines = []
    for line in sql_content.split('\n'):
        line = line.strip()
        if line.startswith('-- DELIMITER') or line.startswith('DELIMITER'):
            continue
        if line == '-- $$' or line == '$$':
            continue
        lines.append(line)
    
    sql_content = '\n'.join(lines)
    
    # Split into DROP and CREATE statements
    statements = []
    current_statement = []
    in_procedure = False
    
    for line in sql_content.split('\n'):
        # Check if this is a DROP statement
        if line.strip().upper().startswith('DROP PROCEDURE'):
            if current_statement:
                statements.append('\n'.join(current_statement))
                current_statement = []
            statements.append(line)
            continue
        
        # Check if we're starting a procedure
        if 'CREATE PROCEDURE' in line.upper():
            in_procedure = True
        
        current_statement.append(line)
        
        # Check if we're ending a procedure
        if line.strip().upper().startswith('END') and in_procedure:
            statements.append('\n'.join(current_statement))
            current_statement = []
            in_procedure = False
    
    # Add any remaining content
    if current_statement:
        content = '\n'.join(current_statement).strip()
        if content:
            statements.append(content)
    
    # Connect and execute
    conn = pymysql.connect(host=host, user=user, password=password, database=db)
    try:
        with conn.cursor() as cursor:
            # Execute each statement separately
            for stmt in statements:
                stmt = stmt.strip()
                if stmt and not stmt.startswith('--'):
                    cursor.execute(stmt)
        conn.commit()
        return 0, b"Success", b""
    except Exception as e:
        return 1, b"", str(e).encode('utf-8')
    finally:
        conn.close()

def main():
    # Load environment variables from .env file
    # Look for .env in the Backend directory (parent of scripts)
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    env_path = os.path.join(backend_dir, '.env')
    
    if os.path.exists(env_path):
        load_dotenv(env_path)
        print(f"Loaded environment from: {env_path}")
    else:
        load_dotenv()  # Try to load from current directory
        print("Warning: .env file not found in Backend directory, using defaults")
    
    # Get database credentials from environment
    db_host = os.getenv('MYSQL_HOST', 'localhost')
    db_user = os.getenv('MYSQL_USER', 'root')
    db_password = os.getenv('MYSQL_PASSWORD', '')
    db_name = os.getenv('MYSQL_DATABASE', 'kandypack_db')
    
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default=db_host, help=f"DB host (default from .env: {db_host})")
    ap.add_argument("--user", default=db_user, help=f"DB user (default from .env: {db_user})")
    ap.add_argument("--db", default=db_name, help=f"DB name (default from .env: {db_name})")
    ap.add_argument("--password", default=db_password, help="DB password (default from .env)")
    ap.add_argument("--dir", default=PROCS_DIR)
    args = ap.parse_args()

    print(f"\nConnecting to database:")
    print(f"  Host: {args.host}")
    print(f"  User: {args.user}")
    print(f"  Database: {args.db}")
    print()

    # Connect with pymysql for bookkeeping
    conn = pymysql.connect(host=args.host, user=args.user, password=args.password, database=args.db, autocommit=False)
    try:
        print("✓ Connected to database successfully\n")
        ensure_bookkeeping(conn)
        applied = get_applied_checksums(conn)
    except Exception as e:
        conn.close()
        print("✗ Error connecting to DB for bookkeeping:", e, file=sys.stderr)
        sys.exit(1)

    # Ensure the procs directory exists
    if not os.path.exists(args.dir):
        print(f"✗ Procedures directory not found: {args.dir}")
        print(f"  Expected path: {os.path.abspath(args.dir)}")
        conn.close()
        sys.exit(1)
    
    print(f"Looking for SQL files in: {args.dir}\n")
    files = sorted([os.path.join(args.dir, f) for f in os.listdir(args.dir) if f.endswith(".sql")])
    if not files:
        print(f"No SQL files found in {args.dir}")
        conn.close()
        return

    print(f"Found {len(files)} SQL procedure file(s)\n")
    print("=" * 70)

    for path in files:
        name = os.path.relpath(path, start=args.dir)
        full_name = os.path.basename(path)
        checksum = sha256_of_file(path)
        if full_name in applied and applied[full_name] == checksum:
            print(f"⊘ Skipping (already applied): {full_name}")
            continue

        print(f"→ Applying: {full_name}")
        # Execute using pymysql directly
        rc, out, err = execute_file_with_mysql_cli(None, args.host, args.user, args.password, args.db, path)
        if rc != 0:
            print(f"✗ mysql client returned error for {full_name}")
            print(err.decode("utf-8", errors="ignore"))
            print("Aborting. No bookkeeping record written.")
            conn.close()
            sys.exit(1)
        # record applied
        try:
            record_applied(conn, full_name, checksum)
            print(f"✓ Recorded: {full_name}\n")
        except Exception as e:
            print("✗ Failed recording applied migration:", e, file=sys.stderr)
            conn.close()
            sys.exit(1)

    conn.close()
    print("=" * 70)
    print("✓ All done! All stored procedures have been applied.")
    print()
if __name__ == "__main__":
    main()