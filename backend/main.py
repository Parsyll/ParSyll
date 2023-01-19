import uvicorn
import firebase_admin
import pyrebase
import json
 
from firebase_admin import credentials, auth, firestore
from fastapi import FastAPI, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import Union
from models.model import User


cred = credentials.Certificate("service_account.json")
firebase_admin.initialize_app(cred)
config = json.load(open('firebase_config.json'))
pb = pyrebase.initialize_app(config)
db = firestore.client()

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
    uid = req['uid']
    doc_ref = db.collection(u'users').document(u'{}'.format(uid))
    doc_ref.set({
        u'Name': u'Ada',
        u'last': u'Lovelace',
        u'born': 1815
    })

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




