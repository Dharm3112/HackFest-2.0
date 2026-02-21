import duckdb
import os

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
PARQUET_FILE = os.path.join(PROJECT_ROOT, "data", "optimized_trans.parquet")

print(f"Checking schema for: {PARQUET_FILE}")

# Connect to DuckDB
conn = duckdb.connect()

# Query the schema of the parquet file
try:
    schema = conn.execute(f"DESCRIBE SELECT * FROM '{PARQUET_FILE}'").df()
    print("\n--- SCHEMA ---")
    print(schema.to_string(index=False))
except Exception as e:
    print(f"Error reading parquet file: {e}")
    
conn.close()
