import pyrebase
import json
import firebase_admin

from firebase_admin import credentials
from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware

cred = credentials.Certificate("service_account.json")
firebase_admin.initialize_app(cred)
config = json.load(open('firebase_config.json'))
pb = pyrebase.initialize_app(config)

app = FastAPI()

origins = [
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET', 'POST'],
    allow_headers=['Content-Type', 'application/xml', "application/pdf", "multipart/form-data"],
)
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"


@app.post("/pdfsubmit")
async def upload_file(file: UploadFile):
    #useful links: 
    # https://stackoverflow.com/questions/64168340/how-to-send-a-file-docx-doc-pdf-or-json-to-fastapi-and-predict-on-it-without
    # https://fastapi.tiangolo.com/tutorial/request-files/

    return {"filename": file.filename}
