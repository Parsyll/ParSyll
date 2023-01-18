from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from typing import Union

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
async def get_pdf(file: UploadFile):
    print("joe mama")