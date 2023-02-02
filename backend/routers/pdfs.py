from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from database import db, auth, bucket

router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"]
)


# pdf submission endpoint
@router.post("/submit")
async def upload_file(file: UploadFile):
    #useful links: 
    # https://stackoverflow.com/questions/64168340/how-to-send-a-file-docx-doc-pdf-or-json-to-fastapi-and-predict-on-it-without
    # https://fastapi.tiangolo.com/tutorial/request-files/

    file_contents = await file.read()

    blob = bucket.blob(file.filename)
    # blob.content_type = file.content_type
    blob.metadata = {'Content-Type': file.content_type}
    blob.upload_from_string(file_contents, content_type=file.content_type)
    print(blob.public_url)
    print(dir(blob))
    # To link with users i guess we just put the public URL into firestore

    return {"filename": file.filename}
