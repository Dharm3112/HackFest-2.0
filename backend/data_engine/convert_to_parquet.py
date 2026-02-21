import polars as pl
import os
import time

def convert_to_parquet(csv_path: str, parquet_path: str):
    """
    Converts a massive CSV file to an optimized Apache Parquet format using Polars Lazy Evaluation.
    This saves massive amounts of disk space and allows DuckDB to query it instantly.
    """
    print(f"Starting conversion of {csv_path} to Parquet...")
    start_time = time.time()
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(parquet_path), exist_ok=True)
    
    # Using Polars lazy scan and sink to process large files without OOM errors
    try:
        (
            pl.scan_csv(csv_path)
            .sink_parquet(parquet_path)
        )
        
        end_time = time.time()
        print(f"Successfully converted {csv_path} to {parquet_path}")
        print(f"Time taken: {end_time - start_time:.2f} seconds")
        
        # Print file sizes
        csv_size = os.path.getsize(csv_path) / (1024 * 1024)
        parquet_size = os.path.getsize(parquet_path) / (1024 * 1024)
        print(f"Original CSV Size: {csv_size:.2f} MB")
        print(f"New Parquet Size: {parquet_size:.2f} MB")
        print(f"Space saved: {csv_size - parquet_size:.2f} MB")
        
    except Exception as e:
        print(f"Error during conversion: {e}")

if __name__ == "__main__":
    # Define absolute or relative paths based on project root
    PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    
    # We start with the Small dataset for development speed
    INPUT_CSV = os.path.join(PROJECT_ROOT, "DataSet", "HI-Small_Trans.csv")
    OUTPUT_PARQUET = os.path.join(PROJECT_ROOT, "data", "optimized_trans.parquet")
    
    if not os.path.exists(INPUT_CSV):
        print(f"⚠️ Input CSV not found at {INPUT_CSV}")
        print("Please ensure the DataSet folder is correctly placed.")
    else:
        convert_to_parquet(INPUT_CSV, OUTPUT_PARQUET)
