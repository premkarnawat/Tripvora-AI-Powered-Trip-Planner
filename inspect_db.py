import os
import psycopg2
from urllib.parse import urlparse

db_url = "postgresql://postgres:Tripvora.database1716#@db.gbmuacxsterrofwvvfow.supabase.co:5432/postgres"

def run_query():
    conn = None
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # Get all tables in public schema
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        """)
        tables = cur.fetchall()
        print("=== Tables in public schema ===")
        for table in tables:
            print(f"- {table[0]}")
            
        print("\n=== Table Columns ===")
        for table in tables:
            table_name = table[0]
            cur.execute(f"""
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'public' AND table_name = '{table_name}'
            """)
            columns = cur.fetchall()
            print(f"\nTable: {table_name}")
            for col in columns:
                print(f"  {col[0]}: {col[1]}")
                
        cur.close()
    except Exception as e:
        print(f"Error connecting to database: {e}")
    finally:
        if conn is not None:
            conn.close()

if __name__ == "__main__":
    run_query()
