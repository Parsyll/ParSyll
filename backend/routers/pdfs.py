import mimetypes

from fastapi import APIRouter, Request, UploadFile, File, Form
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.exceptions import HTTPException
from uuid import uuid4
from database import db, auth, bucket

router = APIRouter(
    prefix="/pdfs",
    tags=["pdfs"]
)


@router.get("/{file_id}")
async def get_file(file_id: str):
    blob = bucket.get_blob(file_id)
    contents = blob.download_as_bytes()

    filename = file_id
    if 'filename' in blob.metadata:
        filename = blob.metadata['filename']
    else:
        file_ext = mimetypes.guess_extension(blob.content_type)
        filename += file_ext

    return Response(content=contents, media_type=blob.content_type, headers={"Content-Disposition": f"attachment;filename={filename}"})


# user download file (should only allow download for files associated with user)

# user upload file
@router.post("/submit/{uid}")
async def user_upload_file(uid: str, file: UploadFile):
    # To link with users i guess we just put the public URL into firestore
    try:
        user = auth.get_user(uid)
        user_doc_ref = db.collection(u'users').document(user.uid)
        user_doc = user_doc_ref.get()

        if not user_doc.exists:
            pass #some error handling

        file_contents = await file.read() 
        file_id = uuid4()
        blob = bucket.blob(str(file_id))
        blob.metadata = {'Content-Type': file.content_type, 'filename': file.filename, 'user': user.uid}
        blob.upload_from_string(file_contents, content_type=file.content_type)

        # get user's current syllabus list
        user_syllabus_ref = user_doc_ref.get(field_paths={'syllabus'})
        user_syllabus_dict = user_syllabus_ref.to_dict()
        print(user_syllabus_dict)

        if user_syllabus_dict and 'syllabus' in user_syllabus_dict and user_syllabus_dict['syllabus']:
            user_syllabus_list = user_syllabus_dict['syllabus']
        else:
            user_syllabus_list = []

        print(user_syllabus_list)
        user_syllabus_list.append(str(file_id))

        # update to user syllabus
        user_doc_ref.update({
            u'syllabus': user_syllabus_list
        })

        

    except auth.UserNotFoundError:
        raise HTTPException(404, detail=f"User {uid} not found")

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, detail="Something went wrong")
    
    return f"Uploaded {file.filename} for user {user.uid}"


# pdf submission endpoint
@router.post("/submit")
async def upload_file(file: UploadFile):
    #useful links: 
    # https://stackoverflow.com/questions/64168340/how-to-send-a-file-docx-doc-pdf-or-json-to-fastapi-and-predict-on-it-without
    # https://fastapi.tiangolo.com/tutorial/request-files/

    file_contents = await file.read() 
    file_id = uuid4()
    blob = bucket.blob(str(file_id))
    blob.metadata = {'Content-Type': file.content_type, 'filename': file.filename}
    blob.upload_from_string(file_contents, content_type=file.content_type)
    print(blob.public_url, blob.metadata)

    return f"File: {file.filename} uploaded as {str(file_id)}"    
