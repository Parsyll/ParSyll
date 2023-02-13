import time
from typing import Dict
import datetime
import jwt
from decouple import config
from fastapi import Request


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

def signAdminJWT(user_id: str) -> Dict[str, str]:
    dt=datetime.datetime.now() + datetime.timedelta(weeks=100)
    payload = {
        "user_id": user_id,
        "expires": dt.isoformat()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token_response(token)

def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        print(datetime.datetime.now())
        return decoded_token if decoded_token['expires'] > datetime.datetime.now().isoformat() else {}
    except:
        return {}

async def getUIDFromAuthorizationHeader(request: Request):
    token = request.headers.get("Authorization")
    token = token.split(" ")[1].strip()
    # print(token)
    token_decoded = decodeJWT(token)
    return token_decoded['user_id']

