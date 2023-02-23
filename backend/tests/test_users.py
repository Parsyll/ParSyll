#IMPORTANT NOTE #############
#### Run the command "python3 -ms pytest tests/" in backend folder"
# pytest has an issue importing modules into th test file"
import requests
import pytest
import os
import sys
from dotenv import load_dotenv
from parsyll_fastapi.auth.auth_handler import decodeJWT
from fastapi.testclient import TestClient
from parsyll_fastapi.main import app

load_dotenv()

admin_jwt_token = os.getenv("admin_jwt_token")
admin_uid = os.getenv("admin_uid")

header = { 'Authorization': f'Bearer {admin_jwt_token}' }
client = TestClient(app)

class TestJWT:

    def test_token_verification_fail(self):
        response = client.get("/users/token/verify")
        assert response.status_code == 403

    def test_token_verification_success(self):
        response = client.get("/users/token/verify", headers=header)
        assert response.status_code == 200

    def test_token_creation_success(self):
        dummy_uid = 'this-is-a-test'
        body = {
            'uid': dummy_uid
        }
        response = client.post("/users/token/create", headers=header, json=body)
        response_json = response.json()
        response_token = response_json['access_token']
        decoded_token = decodeJWT(response_token)
        
        assert response.status_code == 200
        assert decoded_token['user_id'] == dummy_uid    

