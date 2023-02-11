from fastapi import APIRouter, Request, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import Union
from models.model import User
from database import db, auth
from auth.auth_handler import signJWT
from auth.auth_bearer import JWTBearer

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

# FOR TESTING PURPOSES ONLY
@router.post("/add_dummy_users")
async def get_all_users():

    num_dummy_users = 10

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

        print('Sucessfully created new user: {0}'.format(user.uid))
    
    return f'Added {num_dummy_users} dummy users'


# Retrieve users endpoints
@router.get("/")
async def get_all_users():
    users = [user for user in auth.list_users().iterate_all()]
    return users


@router.get("/{uid}")
async def get_user(uid: str):
    try:
        user = auth.get_user(uid)
    except auth.UserNotFoundError:
        raise HTTPException(404, detail=f"User {uid} not found")

    return user
     



# Create users endpoints
'''
Create users assumes user has signed up through auth
'''
@router.post("/create/{uid}")
async def create_user_from_auth(uid: str):
    try:
        user = auth.get_user(uid)
        print('Successfully fetched user data: {0}'.format(user.uid))
        create_user(user.uid, user.display_name, user.email)
    
    except auth.UserNotFoundError:
        raise HTTPException(404, detail="User not found")
 
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, detail="Something went wrong")
    
    return signJWT(uid)
    # return "User added to database"

@router.post("/token/create")
async def generate_token(request: Request):
    try:
        request = await request.json()
        uid = request['uid']
        print(f"Generated JWT Token for User with UID: {uid} \n")
        return signJWT(uid)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, detail="Something went wrong")
    
    # return "User added to database"

@router.get("/token/verify", dependencies=[Depends(JWTBearer())])
async def generate_token(request: Request):
    return Response(content="JWT token is valid", status_code=200)


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
    db.collection(u'users').document(uid).delete()

    return f"Deleted user {uid}"

'''
BECAREFUL WITH THIS ENDPOINT
'''
@router.delete('/delete_all')
async def delete_all_users():
    uids = [user.uid for user in auth.list_users().iterate_all()]
    result = auth.delete_users(uids)

    user_collection = db.collection(u'users')
    delete_collection(user_collection, 1000)

    return "Deleted all users from auth and firestore"


# Helper functions
def create_user(uid, username, email):
    doc_ref = db.collection(u'users').document(uid)
    doc_ref.set({
        'uid': uid,
        'username': username,
        'email': email,
        'syllabus': [],
        'school': [],
        'courses': []
    })

def delete_collection(coll_ref, batch_size):
    docs = coll_ref.list_documents(page_size=batch_size)
    deleted = 0

    for doc in docs:
        print(f'Deleting doc {doc.id} => {doc.get().to_dict()}')
        doc.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(coll_ref, batch_size)

