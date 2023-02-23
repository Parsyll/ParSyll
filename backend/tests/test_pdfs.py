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


class TestPDFSubmission:
    def test_pdf_submission_success(self):
        url = "http://localhost:8000/pdfs/submit"

        header = {
            'Authorization': f'Bearer {admin_jwt_token}'
        }
        file_path = os.path.join(os.getcwd(), "tests", "ie335_syllabus.pdf")
        files = {'file': open(file_path, "rb")}
        
        response = requests.post(url, files=files, headers=header)
        assert response.status_code == 200
    

    def test_pdf_submission_no_auth(self):
        url = "http://localhost:8000/pdfs/submit"

        header = {
            'Authorization': f'Bearer esto-no-funciona'
        }
        file_path = os.path.join(os.getcwd(), "tests", "ie335_syllabus.pdf")
        files = {'file': open(file_path, "rb")}
        
        response = requests.post(url, files=files, headers=header)
        assert response.status_code == 403

    
    def test_pdf_submission_no_file(self):
        url = "http://localhost:8000/pdfs/submit"

        header = {
            'Authorization': f'Bearer {admin_jwt_token}'
        }

        response = requests.post(url, headers=header)
        assert response.status_code == 422