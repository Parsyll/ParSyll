from fastapi import APIRouter, Request, UploadFile
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from database import db, auth

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

    return {"filename": file.filename}

