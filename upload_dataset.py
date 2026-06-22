import os
import zipfile
import httpx

zip_path = r"C:\Users\Chait\Downloads\Shakti_Hackathon_Dataset.zip"
extract_dir = r"C:\Users\Chait\Downloads\Shakti_Hackathon_Dataset"

print(f"Extracting {zip_path}...")
with zipfile.ZipFile(zip_path, 'r') as zip_ref:
    zip_ref.extractall(extract_dir)

url = "http://localhost:8000/upload"

for root, dirs, files in os.walk(extract_dir):
    for file in files:
        file_path = os.path.join(root, file)
        print(f"Uploading {file}...")
        try:
            with open(file_path, 'rb') as f:
                # The 'file' key must match the backend's expected parameter
                files_payload = {'file': (file, f, 'application/octet-stream')}
                response = httpx.post(url, files=files_payload, timeout=60.0)
                print(f"Status: {response.status_code}, Response: {response.text}")
        except Exception as e:
            print(f"Failed to upload {file}: {e}")
