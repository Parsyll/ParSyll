import time
from typing import Dict
import datetime
import jwt
from decouple import config


JWT_SECRET = config("secret")
JWT_ALGORITHM = config("algorithm")


def token_response(token: str):
    return {
        "access_token": token
    }


def signJWT(user_id: str) -> Dict[str, str]:
    dt=datetime.datetime.now() + datetime.timedelta(hours=24)
    payload = {
        "user_id": user_id,
        "expires": dt.isoformat()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token_response(token)

def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        print(decoded_token)
        print(datetime.datetime.now())
        return decoded_token if decoded_token['expires'] > datetime.datetime.now().isoformat() else {}
    except:
        return {}
