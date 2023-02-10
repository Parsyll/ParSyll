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

## Download File endpoints

# This endpoint can be used to download any file
@router.get("/{file_id}")
async def get_file(file_id: str):
    blob = bucket.get_blob(file_id)
    contents = blob.download_as_bytes()

    # filename for pdf download
    filename = file_id
    if 'filename' in blob.metadata:
        filename = blob.metadata['filename']
    else:
        file_ext = mimetypes.guess_extension(blob.content_type)
        filename += file_ext
    
    # TODO error handling for bucket.get_blob with no valid file_id

    return Response(content=contents, media_type=blob.content_type, headers={"Content-Disposition": f"attachment;filename={filename}"})


# This endpoint can only download file user:uid owns
# user download file (should only allow download for files associated with user)
@router.get("/{uid}/{file_id}")
async def user_get_file(uid: str, file_id: str):
    user_doc_ref = db.collection(u'users').document(uid)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        raise HTTPException(404, detail=f"User {uid} does not exist")

    user_syllabus_list = get_user_syllabus(user_doc_ref)
    print(user_syllabus_list)

    if file_id not in user_syllabus_list:
        raise HTTPException(404, detail=f"File {file_id} does not exist for user {uid}")
    
    blob = bucket.get_blob(file_id)
    contents = blob.download_as_bytes()

    # filename for pdf download
    filename = file_id
    if 'filename' in blob.metadata:
        filename = blob.metadata['filename']
    else:
        file_ext = mimetypes.guess_extension(blob.content_type)
        filename += file_ext

    # TODO error handling for bucket.get_blob with no valid file_id
     
    return Response(content=contents, media_type=blob.content_type, headers={"Content-Disposition": f"attachment;filename={filename}"})

## Upload file endpoints

# user upload file
@router.post("/submit/{uid}")
async def user_upload_file(uid: str, file: UploadFile):

    try: 
        user = auth.get_user(uid)
    except auth.UserNotFoundError:
        raise HTTPException(404, detail=f"User {uid} not found")
    
    user_doc_ref = db.collection(u'users').document(user.uid)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        raise HTTPException(404, detail=f"User {uid} does not exist")

    file_contents = await file.read() 
    file_id = uuid4()
    blob = bucket.blob(str(file_id))
    # add user in metadata to associate file with user
    blob.metadata = {'Content-Type': file.content_type, 'filename': file.filename, 'user': user.uid}
    blob.upload_from_string(file_contents, content_type=file.content_type)

    user_syllabus_list = get_user_syllabus(user_doc_ref)

    print(user_syllabus_list)
    user_syllabus_list.append(str(file_id))

    # update to user syllabus
    user_doc_ref.update({
        u'syllabus': user_syllabus_list
    })

        
    
    return f"Uploaded {file.filename} for user {user.uid}"


# upload file not associated to any user
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


## DELETE file endpoints

# Delete all file of user:uid
@router.delete("/{uid}")
async def delete_user_files(uid: str):
    pass

# Delete file:file_id of user:uid
@router.delete("/{uid}/{file_id}")
async def delete_user_file(uid: str, file_id: str):
    pass

# CAREFUL WITH THIS ENDPOINT: Delete all files in storage bucket and associated users' db entries
@router.delete("/all")
async def delete_all_file_in_firebase():
    pass



# Helper functions

def get_user_syllabus(user_doc_ref):
    # get user's current syllabus list
    user_syllabus_ref = user_doc_ref.get(field_paths={'syllabus'})
    user_syllabus_dict = user_syllabus_ref.to_dict()

    if user_syllabus_dict and 'syllabus' in user_syllabus_dict and user_syllabus_dict['syllabus']:
        user_syllabus_list = user_syllabus_dict['syllabus']
    else:
        user_syllabus_list = []
    
    return user_syllabus_list
