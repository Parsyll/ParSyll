import uvicorn
import firebase_admin
import pyrebase
import json
 
from firebase_admin import credentials, auth
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from typing import Union

cred = credentials.Certificate('service_account.json')
firebase = firebase_admin.initialize_app(cred)
pb = pyrebase.initialize_app(json.load(open('firebase_config.json')))

app = FastAPI()
origins = [
    "http://localhost:3001"
]

allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)
 
# signup endpoint
@app.post("/signup", include_in_schema=False)
async def signup(request: Request):
   req = await request.json()
   email = req['email']
   password = req['password']
   if email is None or password is None:
       return HTTPException(detail={'message': 'Error! Missing Email or Password'}, status_code=400)
   try:
       user = auth.create_user(
           email=email,
           password=password
       )
       return JSONResponse(content={'message': f'Successfully created user {user.uid}'}, status_code=200)    
   except:
       return HTTPException(detail={'message': 'Error Creating User'}, status_code=400)

# login endpoint
@app.post("/login", include_in_schema=False)
async def login(request: Request):
   req_json = await request.json()
   email = req_json['email']
   password = req_json['password']
   try:
       user = pb.auth().sign_in_with_email_and_password(email, password)
       jwt = user['idToken']
       return JSONResponse(content={'token': jwt}, status_code=200)
   except:
       return HTTPException(detail={'message': 'There was an error logging in'}, status_code=400)


# ping endpoint
@app.post("/ping", include_in_schema=False)
async def validate(request: Request):
   headers = request.headers
   jwt = headers.get('authorization')
   print(f"jwt:{jwt}")
   user = auth.verify_id_token(jwt)
   return user["uid"]
 

# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

# pdf submission endpoint
@app.post("/pdfsubmit")
async def upload_file(file: UploadFile):
    #useful links: 
    # https://stackoverflow.com/questions/64168340/how-to-send-a-file-docx-doc-pdf-or-json-to-fastapi-and-predict-on-it-without
    # https://fastapi.tiangolo.com/tutorial/request-files/

    return {"filename": file.filename}

if __name__ == "__main__":
   uvicorn.run("main:app")




