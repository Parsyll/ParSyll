from fastapi import APIRouter, Request, UploadFile, File, Form, Depends
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from database import db, auth, bucket
from auth.auth_bearer import JWTBearer
from auth.auth_handler import getUIDFromAuthorizationHeader

router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"]
)


# pdf submission endpoint
@router.post("/submit", dependencies=[Depends(JWTBearer())])
async def upload_file(file: UploadFile, request: Request, uid=Depends(getUIDFromAuthorizationHeader)):
    print(uid)
    # file_contents = await file.read()

    # blob = bucket.blob(file.filename)
    # blob.content_type = file.content_type
    # blob.metadata = {'Content-Type': file.content_type}
    # blob.upload_from_string(file_contents, content_type=file.content_type)
    # print(blob.public_url)
    # print(dir(blob))
    # # To link with users i guess we just put the public URL into firestore

    return {"filename": file.filename}
