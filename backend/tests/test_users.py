# IMPORTANT NOTE #############
#### Run the command "python3 -ms pytest tests/" in backend folder"
# pytest has an issue importing modules into th test file"
import requests
import pytest
import os
import sys
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from parsyll_fastapi.main import app
from parsyll_fastapi.database import auth
from parsyll_fastapi.daos.userDao import UserDAO


from parsyll_fastapi.routers import users

from .mocks import MockUserRecord, MockUser

load_dotenv()

admin_jwt_token = os.getenv("ADMIN_JWT_TOKEN")
admin_uid = os.getenv("ADMIN_UID")

print(admin_jwt_token)
print(admin_uid)

header = {"Authorization": f"Bearer {admin_jwt_token}"}
client = TestClient(app)

mockuser = MockUser("test123", "testAccount", "testAccount1234")


class TestJWT:
    def test_token_verification_fail(self):
        response = client.get("/users/token/verify")
        assert response.status_code == 403

    def test_token_verification_success_and_user_creation(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get", mockuser.mock_userdao_get_success)
        response = client.get("/users/token/verify", headers=header)

        assert response.status_code == 200

    def test_get_all_users(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get_all", mockuser.mock_userdao_get_all)
        response = client.get("/users/")

        assert response.status_code == 200

    def test_get_current_user_success(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get", mockuser.mock_userdao_get_success)
        response = client.get("/users/get_current_user", headers=header)

        assert response.status_code == 200

    def test_get_current_user_fail(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get", mockuser.mock_userdao_get_fail)
        response = client.get("/users/get_current_user", headers=header)

        assert response.status_code == 404

    def test_user_by_uid_success(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get", mockuser.mock_userdao_get_success)
        fake_uid = "thisIsATestString1234"
        response = client.get(f"/users/{fake_uid}", headers=header)

        assert response.status_code == 200

    def test_user_by_uid_fail(self, monkeypatch):

        monkeypatch.setattr(UserDAO, "get", mockuser.mock_userdao_get_fail)
        fake_uid = "thisIsATestString1234"
        response = client.get(f"/users/{fake_uid}", headers=header)

        assert response.status_code == 404

    def test_user_update_by_uid_success(self, monkeypatch):
        monkeypatch.setattr(UserDAO, "update", mockuser.mock_userdao_update_success)
        fake_uid = "thisIsATestString1234"
        response = client.put(
            f"/users/{fake_uid}", json=mockuser.userdict, headers=header
        )

        assert response.status_code == 200

    def test_user_update_by_uid_user_not_found_fail(self, monkeypatch):
        monkeypatch.setattr(UserDAO, "update", mockuser.mock_userdao_update_fail)
        fake_uid = "thisIsATestString1234"
        response = client.put(
            f"/users/{fake_uid}", json=mockuser.userdict, headers=header
        )

        assert response.status_code == 404

    def test_user_update_by_uid_missing_body_fail(self, monkeypatch):
        monkeypatch.setattr(UserDAO, "update", mockuser.mock_userdao_update_fail)
        fake_uid = "thisIsATestString1234"
        response = client.put(f"/users/{fake_uid}", headers=header)

        assert response.status_code == 422

    # def test_create_user_from_auth_success(self, monkeypatch):
    #     monkeypatch.setattr(auth, "get_user", mockuser.mock_auth_get_user_success)
    #     monkeypatch.setattr(users, "create_user", mockuser.mock_create_user_success)
    #     fake_uid = "thisIsATestString1234"
    #     response = client.post(f"/users/create/{fake_uid}", headers=header, json=mockuser.userdict)

    #     assert response.status_code == 200

    # def test_create_user_from_auth_user_not_found_fail(self, monkeypatch):
    #     monkeypatch.setattr(auth, "get_user", mockuser.mock_auth_get_user_success)
    #     monkeypatch.setattr(users, "create_user", mockuser.mock_auth_get_user_not_found)
    #     fake_uid = "thisIsATestString1234"
    #     response = client.post(f"/users/create/{fake_uid}", headers=header, json=mockuser.userdict)

    #     assert response.status_code == 200

    # def test_delete_user_success(self, monkeypatch):
    #     monkeypatch.setattr(auth, "delete_users", mockuser.mock_auth_delete_user_success)
    #     monkeypatch.setattr(users, "delete_collection", mockuser.mock_delete_collection_success)
    #     fake_uid = "thisIsATestString1234"
    #     response = client.post(f"/users/delete/{fake_uid}", headers=header)

    #     assert response.status_code == 200


#     def test_token_creation_success(self):
#         dummy_uid = 'this-is-a-test'
#         body = {
#             'uid': dummy_uid
#         }
#         response = client.post("/users/token/create", json=body)
#         response_json = response.json()
#         response_token = response_json['access_token']
#         decoded_token = decodeJWT(response_token)

#         assert response.status_code == 200
#         assert decoded_token['user_id'] == dummy_uid

# class TestUsers:
#     def test_get_user_fail(self):
#         body = {
#             "email": "dummydummy@gmail.com",
#             "password": "123456",
#             "username": "dummydummy"
#         }
#         response = client.post("/users/create_user_manually", headers=header, json=body)
#         print("JOE")
#         response_json = response.json()
#         uid = response_json['uid']
#         header_temp = { 'Authorization': f"Bearer {response_json['jwtToken']}" }

#         response = client.get(f"/users/{uid}", headers=header_temp)
#         response_json = response.json()
#         assert response.status_code == 200
#         assert response_json['_data']['displayName'] == body["username"]

#     def test_get_user_success(self):
#         response = client.get(f"/users/doesnt_work", headers=header)
#         assert response.status_code == 404

#     def test_get_delete_success(self):
#         body = {
#             "email": "dummydummy@gmail.com",
#             "password": "123456",
#             "username": "dummydummy"
#         }
#         response = client.post("/users/create_user_manually", headers=header, json=body)
#         response_json = response.json()
#         uid = response_json['uid']
#         response = client.delete(f"/users/delete/{uid}")
#         response_json = response.json()
#         print(response)
#         assert response.status_code == 200
