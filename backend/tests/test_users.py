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
        response = client.post("/users/token/create", json=body)
        response_json = response.json()
        response_token = response_json['access_token']
        decoded_token = decodeJWT(response_token)
        
        assert response.status_code == 200
        assert decoded_token['user_id'] == dummy_uid    

class TestUsers:
    def test_get_user_fail(self):
        body = {
            "email": "dummydummy@gmail.com",
            "password": "123456",
            "username": "dummydummy"
        }
        response = client.post("/users/create_user_manually", headers=header, json=body)
        print("JOE")
        response_json = response.json()
        uid = response_json['uid']
        header_temp = { 'Authorization': f"Bearer {response_json['jwtToken']}" }
        
        response = client.get(f"/users/{uid}", headers=header_temp)
        response_json = response.json()
        assert response.status_code == 200
        assert response_json['_data']['displayName'] == body["username"]
    
    def test_get_user_success(self):        
        response = client.get(f"/users/doesnt_work", headers=header)
        assert response.status_code == 404
    
    def test_get_delete_success(self):
        body = {
            "email": "dummydummy@gmail.com",
            "password": "123456",
            "username": "dummydummy"
        }
        response = client.post("/users/create_user_manually", headers=header, json=body)
        response_json = response.json()
        uid = response_json['uid']
        response = client.delete(f"/users/delete/{uid}")
        response_json = response.json()
        print(response)
        assert response.status_code == 200
    
