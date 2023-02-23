from fastapi import APIRouter, Request, UploadFile, File, Form, Depends
import mimetypes
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.exceptions import HTTPException
from uuid import uuid4
from database import db, auth, bucket
from auth.auth_bearer import JWTBearer
from auth.auth_handler import getUIDFromAuthorizationHeader

router = APIRouter(
    prefix="/parse_pdf",
    tags=["parse_pdf"]
)

