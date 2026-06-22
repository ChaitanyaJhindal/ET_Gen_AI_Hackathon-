import os
import requests
import time

dataset_dir = "Shakti_Hackathon_Dataset"
api_url = "http://localhost:8000/api/upload" # Corrected path if needed? Wait, the router is just /upload, but the main.py might prefix it. Let me check the print output. Wait, in RCA we hit /rca, let's assume it's /api/upload.
# Actually I'll check main.py

if not os.path.exists(dataset_dir):
    print(f"Directory {dataset_dir} not found.")
    exit(1)

files = [f for f in os.listdir(dataset_dir) if os.path.isfile(os.path.join(dataset_dir, f))]
print(f"Found {len(files)} files to ingest.")

for filename in files:
    filepath = os.path.join(dataset_dir, filename)
    print(f"Uploading {filename}...")
    
    with open(filepath, "rb") as f:
        files_param = {"file": (filename, f)}
        try:
            response = requests.post("http://localhost:8000/upload", files=files_param)
            if response.status_code == 200:
                print(f"SUCCESS: {filename}")
            else:
                print(f"FAILED: {filename} - {response.text}")
        except Exception as e:
            print(f"ERROR connecting to API for {filename}: {e}")
    
    time.sleep(2)

print("Ingestion complete!")
