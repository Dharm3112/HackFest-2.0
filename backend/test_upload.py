import requests
import json
import os

URL = "http://127.0.0.1:8001/api/policy/upload"
FILE_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "dummy_aml_policy.md"))

print(f"Uploading {FILE_PATH} to {URL}...")

try:
    with open(FILE_PATH, "rb") as f:
        files = {"file": (os.path.basename(FILE_PATH), f, "text/markdown")}
        response = requests.post(URL, files=files)
        
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
