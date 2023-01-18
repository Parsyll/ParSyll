from fastapi import FastAPI, UploadFile, File
from starlette.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from typing import Union

app = FastAPI()

origins = [
    "http://localhost:3001"
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
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
