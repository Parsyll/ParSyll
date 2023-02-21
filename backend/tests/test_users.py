#IMPORTANT NOTE #############
#### Run the command "python3 -ms pytest tests/" in backend folder"
# pytest has an issue importing modules into th test file"
import requests
import pytest
import os
import sys
from dotenv import load_dotenv
from parsyll_fastapi.auth.auth_handler import decodeJWT

load_dotenv()

admin_jwt_token = os.getenv("admin_jwt_token")
admin_uid = os.getenv("admin_uid")

class TestJWT:
    def test_token_verification_fail(self):
        url = "http://localhost:8000/users/token/verify"
        response = requests.get(url)
        assert response.status_code == 403

    def test_token_verification_success(self):
        header = {
            'Authorization': f'Bearer {admin_jwt_token}'
        }
        url = "http://localhost:8000/users/token/verify"
        response = requests.get(url, headers=header)
        assert response.status_code == 200

    def test_token_creation_success(self):
        dummy_uid = 'this-is-a-test'
        body = {
            'uid': dummy_uid
        }
        url = "http://localhost:8000/users/token/create"
        response = requests.post(url, json=body)
        response_json = response.json()
        response_token = response_json['access_token']
        decoded_token = decodeJWT(response_token)
        print("This is the decoded token:")
        print(decoded_token)
        
        assert response.status_code == 200
        assert decoded_token['user_id'] == dummy_uid    