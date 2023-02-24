from fastapi import APIRouter, Request, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import Union
from parsyll_fastapi.models.model import User, Course
from parsyll_fastapi.database import db, auth
from parsyll_fastapi.auth.auth_handler import signJWT, signAdminJWT
from parsyll_fastapi.auth.auth_bearer import JWTBearer
from parsyll_fastapi.auth.auth_handler import getUIDFromAuthorizationHeader

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# FOR TESTING PURPOSES ONLY
@router.post("/add_dummy_users")
async def add_dummy_users():

    num_dummy_users = 10
    uid = ""
    for i in range(num_dummy_users):
        email = f'user{i}@example.com'
        username = f'USER{i}'

        user = auth.create_user(
            email=email,
            email_verified=False,
            password='secretPassword',
            display_name=username,
            disabled=False
            )
        
        create_user(user.uid, username, email)
        uid = user.uid

        print('Successfully created new user: {0}'.format(user.uid))
    
    return f'Added {num_dummy_users} dummy users, uid of one: {uid}'


# Retrieve users endpoints
@router.get("/")
async def get_all_users():
    users = []    
    for user in auth.list_users().iterate_all():
        users.append(_get_user(user.uid))


    return users


@router.get("/{uid}")
async def get_user(uid: str):
    return _get_user(uid)


# Create users endpoints
'''
Create users assumes user has signed up through auth
'''

# Maybe add a user already exists check here to prevent duplicate adds
@router.post("/create/{uid}")
async def create_user_from_auth(uid: str):
    try:
        user = auth.get_user(uid)
        print('Successfully fetched user data: {0}'.format(user.uid))
        create_user(user.uid, user.display_name, user.email)
    
    except auth.UserNotFoundError:
        raise HTTPException(404, detail="User not found") 
    
    return signJWT(uid)

@router.post("/token/create")
async def generate_token(request: Request):
    request = await request.json()
    uid = request['uid']
    print(f"Generated JWT Token for User with UID: {uid} \n")

    return signJWT(uid) 

@router.post("/admin/token/create")
async def generate_token(request: Request):
    request = await request.json()
    uid = request['uid']
    print(f"Generated JWT Token for User with UID: {uid} \n")

    return signAdminJWT(uid)    

@router.get("/token/verify", dependencies=[Depends(JWTBearer())])
async def generate_token(request: Request, uid = Depends(getUIDFromAuthorizationHeader)):
    print(uid)
    try:
        user = auth.get_user(uid)
        print('Successfully fetched user data: {0}'.format(user.uid))
        create_user(user.uid, user.display_name, user.email)
    
    except auth.UserNotFoundError:
        raise HTTPException(404, detail=f"User with UID = {uid} could not found")
 
    return Response(content=f"JWT token is valid for user of UID = {uid} ", status_code=200)


@router.post("/auth_map")
async def map_users_from_auth():
    for user in auth.list_users().iterate_all():
        user_doc = db.collection(u'users').document(user.uid).get()
        if not user_doc.exists:
            print(user.uid)
            create_user(user.uid, user.display_name, user.email)
         
    return "Users from auth has been mapped to firestore"


# Update endpoints

# Delete endpoints
@router.delete('/delete/{uid}')
async def delete_user(uid: str):
    auth.delete_user(uid)

    user_ref = db.collection(u'users').document(uid)
    courses_ref = user_ref.collection(u'courses')
    delete_collection(courses_ref, 1000)
    db.collection(u'users').document(uid).delete()

    return f"Deleted user {uid}"

'''
BECAREFUL WITH THIS ENDPOINT
'''
@router.delete('/delete_all')
async def delete_all_users():
    uids = [user.uid for user in auth.list_users().iterate_all()]
    result = auth.delete_users(uids)

    for uid in uids:
        user_doc_ref = db.collection(u'users').document(uid)
        courses_ref = user_doc_ref.collection(u'courses')
        delete_collection(courses_ref, 1000)

    user_collection = db.collection(u'users')
    delete_collection(user_collection, 1000)

    return "Deleted all users from auth and firestore"


# Helper functions
def _get_user(uid: str):
    user_doc_ref = db.collection(u'users').document(uid)
    user_doc = user_doc_ref.get()

    if not user_doc.exists:
        raise HTTPException(404, detail=f"User {uid} does not exist")
    
    courses_ref = user_doc_ref.collection(u'courses')
    courses_docs = courses_ref.stream()
    courses_dict = {}
    for course_doc in courses_docs:
        courses_dict[course_doc.id] = course_doc.to_dict()
    
    user_dict = user_doc.to_dict()
    if len(courses_dict) > 0:
        user_dict['courses'] = courses_dict

    return user_dict

def create_user(uid, username, email):
    doc_ref = db.collection(u'users').document(uid)
    user = User(uid=uid, username=username, email=email)
    doc_ref.set(user.__dict__)

def delete_collection(coll_ref, batch_size=1000):
    docs = coll_ref.list_documents(page_size=batch_size)
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.get().to_dict()}')
        doc.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

