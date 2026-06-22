from fastapi.testclient import TestClient
from app.main import app
import json

client = TestClient(app)

def test_app():
    print("Testing /chat endpoint...")
    response = client.post("/chat", json={"question": "What is the status of P-101?"})
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")

if __name__ == "__main__":
    test_app()
