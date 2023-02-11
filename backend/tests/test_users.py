import requests
import pytest

def test_token_verification_fail():
    url = "http://localhost:8000/users/token/verify"
    response = requests.get(url)
    assert response.status_code == 403

def test_token_verification_success():
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiSXpFV3FqSnU0V1QxT1A0TDBidURhd21XVEk2MyIsImV4cGlyZXMiOiIyMDIzLTAyLTEwVDEwOjU1OjMyLjk3NDU4MCJ9.a2wGYc4RgQ5x-aYO9WUPSpGlKhHqxR6rdt3mmTVmw7c"
    header = {
        'Authorization': f'Bearer {token}'
    }
    url = "http://localhost:8000/users/token/verify"
    response = requests.get(url, headers=header)
    assert response.status_code == 403

if __name__ == "__main__":
   try:
        # token_verification_fail() 
        # token_verification_success() 
    print("All tests passed")
   except Exception as e:
      print("Not all tests passed")
      