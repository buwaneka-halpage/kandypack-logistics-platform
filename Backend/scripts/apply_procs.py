#!/usr/bin/env python3
"""
Idempotent runner for SQL procedure files.
Usage:
  python scripts\\apply_procs.py --user root --db KandyPack_DB
(You will be prompted for DB password)
"""

import os
import sys
import hashlib
import argparse
import subprocess
from datetime import datetime
import pymysql

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

def execute_file_with_mysql_cli(mysql_path, host, user, password, db, filepath):
    # Use mysql client and pass file content via stdin to avoid shell redirection issues
    cmd = [mysql_path, "-h", host, "-u", user, f"-p{password}", db]
    with open(filepath, "rb") as fh:
        proc = subprocess.run(cmd, stdin=fh, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    return proc.returncode, proc.stdout, proc.stderr

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--mysql", default="mysql", help="mysql client path (default 'mysql' in PATH)")
    ap.add_argument("--host", default="localhost")
    ap.add_argument("--user", required=True)
    ap.add_argument("--db", required=True)
    ap.add_argument("--password", default=None, help="DB password (or omit to prompt)")
    ap.add_argument("--dir", default=PROCS_DIR)
    args = ap.parse_args()

    if args.password is None:
        import getpass
        args.password = getpass.getpass(f"Password for {args.user}@{args.host}: ")

    # Connect with pymysql for bookkeeping
    conn = pymysql.connect(host=args.host, user=args.user, password=args.password, database=args.db, autocommit=False)
    try:
        ensure_bookkeeping(conn)
        applied = get_applied_checksums(conn)
    except Exception as e:
        conn.close()
        print("Error connecting to DB for bookkeeping:", e, file=sys.stderr)
        sys.exit(1)

    files = sorted([os.path.join(args.dir, f) for f in os.listdir(args.dir) if f.endswith(".sql")])
    if not files:
        print("No SQL files found in", args.dir)
        return

    for path in files:
        name = os.path.relpath(path, start=args.dir)
        full_name = os.path.basename(path)
        checksum = sha256_of_file(path)
        if full_name in applied and applied[full_name] == checksum:
            print(f"Skipping (already applied, checksum matches): {full_name}")
            continue

        print("Applying:", full_name)
        # Execute using mysql CLI (so DELIMITER and CREATE PROCEDURE work reliably)
        rc, out, err = execute_file_with_mysql_cli(args.mysql, args.host, args.user, args.password, args.db, path)
        if rc != 0:
            print("mysql client returned error for", full_name)
            print(err.decode("utf-8", errors="ignore"))
            print("Aborting. No bookkeeping record written.")
            conn.close()
            sys.exit(1)
        # record applied
        try:
            record_applied(conn, full_name, checksum)
            print("Recorded:", full_name)
        except Exception as e:
            print("Failed recording applied migration:", e, file=sys.stderr)
            conn.close()
            sys.exit(1)

    conn.close()
    print("All done.")
if __name__ == "__main__":
    main()