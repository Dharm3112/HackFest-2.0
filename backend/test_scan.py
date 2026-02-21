import requests
import json
import time

BASE_URL = "http://127.0.0.1:8001"

print("--- Step 1: Triggering Data Engine Scan against Parquet... ---")
start_time = time.time()
scan_response = requests.post(f"{BASE_URL}/api/scan/trigger")
end_time = time.time()

print(f"Status Code: {scan_response.status_code}")
print(f"Time Taken: {end_time - start_time:.2f} seconds")
scan_data = scan_response.json()
print("Response JSON:")
print(json.dumps(scan_data, indent=2))
print("\n")

if scan_data.get("new_violations_found", 0) > 0:
    print("--- Step 2: Fetching resulting Violations... ---")
    violations_response = requests.get(f"{BASE_URL}/api/violations")
    print(f"Status Code: {violations_response.status_code}")
    print("Top 2 Violations:")
    
    violations_data = violations_response.json()
    print(json.dumps(violations_data[:2], indent=2))
else:
    print("No new violations found. Ensure rules are loaded in the database first!")
