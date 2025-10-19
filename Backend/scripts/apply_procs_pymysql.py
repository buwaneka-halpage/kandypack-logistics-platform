#!/usr/bin/env python3
"""
Python-only idempotent runner for SQL procedure files (no mysql CLI required).
Usage:
  python scripts\\apply_procs_pymysql.py --user root --db kandypack_db --password "yourpass"
"""

import os
import sys
import hashlib
import argparse
from datetime import datetime
import pymysql
import re

PROCS_DIR = os.path.join("migrations", "sql", "procs")
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
    with conn.cursor() as cur:
        cur.execute(f"""
        INSERT INTO {BOOKKEEP_TABLE} (filename, checksum, applied_at)
        VALUES (%s, %s, %s)
        ON DUPLICATE KEY UPDATE checksum=%s, applied_at=%s
        """, (filename, checksum, datetime.utcnow(), checksum, datetime.utcnow()))
    conn.commit()

def execute_proc_file_pymysql(conn, filepath):
    """
    Parse and execute stored procedure SQL file using pymysql.
    Handles both commented and uncommented DELIMITER syntax.
    """
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove commented DELIMITER lines and clean up
    lines = []
    for line in content.split('\n'):
        # Skip commented DELIMITER lines
        if re.match(r'^\s*--\s*DELIMITER', line, re.IGNORECASE):
            continue
        lines.append(line)
    
    content = '\n'.join(lines)
    
    # Split statements by semicolon, but be smart about procedure bodies
    # For procedures, we need to execute the entire CREATE PROCEDURE as one statement
    statements = []
    current = []
    in_procedure = False
    
    for line in lines:
        line_stripped = line.strip()
        
        # Check if we're starting a procedure
        if re.match(r'^\s*CREATE\s+(PROCEDURE|FUNCTION)', line, re.IGNORECASE):
            in_procedure = True
        
        current.append(line)
        
        # If we're in a procedure, look for END without semicolon or with semicolon
        if in_procedure:
            if re.match(r'^\s*END\s*;?\s*$', line_stripped, re.IGNORECASE):
                # End of procedure
                stmt = '\n'.join(current).strip()
                # Remove trailing semicolon if present
                if stmt.endswith(';'):
                    stmt = stmt[:-1].strip()
                if stmt:
                    statements.append(stmt)
                current = []
                in_procedure = False
        elif line_stripped.endswith(';'):
            # Regular statement ending
            stmt = '\n'.join(current).strip()
            if stmt:
                statements.append(stmt)
            current = []
    
    # Add any remaining content
    if current:
        stmt = '\n'.join(current).strip()
        if stmt and stmt != ';':
            statements.append(stmt)
    
    # Execute each statement
    cursor = conn.cursor()
    try:
        for stmt in statements:
            stmt = stmt.strip()
            if stmt and not stmt.startswith('--') and stmt != ';':
                # Remove trailing semicolon for procedures
                if stmt.endswith(';'):
                    stmt = stmt[:-1].strip()
                if stmt:
                    cursor.execute(stmt)
        conn.commit()
        return True, None
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        cursor.close()

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--host", default="localhost")
    ap.add_argument("--user", required=True)
    ap.add_argument("--db", required=True)
    ap.add_argument("--password", default=None, help="DB password (or omit to prompt)")
    ap.add_argument("--dir", default=PROCS_DIR)
    args = ap.parse_args()

    if args.password is None:
        import getpass
        args.password = getpass.getpass(f"Password for {args.user}@{args.host}: ")

    # Connect with pymysql for bookkeeping and execution
    try:
        conn = pymysql.connect(
            host=args.host,
            user=args.user,
            password=args.password,
            database=args.db,
            autocommit=False
        )
    except Exception as e:
        print("Error connecting to DB:", e, file=sys.stderr)
        sys.exit(1)

    try:
        ensure_bookkeeping(conn)
        applied = get_applied_checksums(conn)
    except Exception as e:
        conn.close()
        print("Error setting up bookkeeping:", e, file=sys.stderr)
        sys.exit(1)

    if not os.path.isdir(args.dir):
        print(f"Procedures directory not found: {args.dir}")
        conn.close()
        return

    files = sorted([os.path.join(args.dir, f) for f in os.listdir(args.dir) if f.endswith(".sql")])
    if not files:
        print("No SQL files found in", args.dir)
        conn.close()
        return

    for path in files:
        full_name = os.path.basename(path)
        checksum = sha256_of_file(path)
        
        if full_name in applied and applied[full_name] == checksum:
            print(f"✓ Skipping (already applied): {full_name}")
            continue

        print(f"→ Applying: {full_name}")
        success, error = execute_proc_file_pymysql(conn, path)
        
        if not success:
            print(f"✗ Error applying {full_name}: {error}")
            print("Aborting. No bookkeeping record written.")
            conn.close()
            sys.exit(1)
        
        # Record applied
        try:
            record_applied(conn, full_name, checksum)
            print(f"✓ Recorded: {full_name}")
        except Exception as e:
            print("Failed recording applied migration:", e, file=sys.stderr)
            conn.close()
            sys.exit(1)

    conn.close()
    print("\n✅ All stored procedures applied successfully!")

if __name__ == "__main__":
    main()
