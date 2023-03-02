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

header = {'Authorization': f'Bearer {admin_jwt_token}'}
client = TestClient(app)

file_path = os.path.join(os.path.dirname(__file__), "ie335_syllabus.pdf")

class TestPDFSubmission:

    def test_pdf_submission_success(self):
        files = {'file': open(file_path, "rb")}
        
        response = client.post("/pdfs/submit", headers=header, files=files)
        response_json = response.json()
        assert response.status_code == 200
        assert response_json['filename'] == "ie335_syllabus.pdf"
    

    def test_pdf_submission_no_auth(self):
        files = {'file': open(file_path, "rb")}
        
        response = client.post("/pdfs/submit", files=files)
        assert response.status_code == 403

    
    def test_pdf_submission_no_file(self):
        response = client.post("/pdfs/submit", headers=header)
        assert response.status_code == 422
    
    def test_delete_file_by_file_id(self):
        files = {'file': open(file_path, "rb")}
        response = client.post("/pdfs/submit", headers=header, files=files)
        response_json = response.json()
        file_id, filename = response_json['file_id'], response_json['filename']
        response = client.delete(f"/pdfs/file/{file_id}", headers=header)
        response_json = response.json()
        print(response_json)
        assert response_json['file_id'] == file_id
        assert 200 == response.status_code