from fastapi import APIRouter, Request, Depends, Response, Body
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException
from typing import List
from parsyll_fastapi.models.model import User, UserResponse, Course
from parsyll_fastapi.database import db, auth
from parsyll_fastapi.daos.courseDao import CourseDAO
from parsyll_fastapi.daos.userDao import UserDAO
from parsyll_fastapi.auth.auth_handler import signJWT, signAdminJWT
from parsyll_fastapi.auth.auth_bearer import JWTBearer
from parsyll_fastapi.auth.auth_handler import getUIDFromAuthorizationHeader

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

course_dao = CourseDAO()
user_dao = UserDAO()

# FOR TESTING PURPOSES ONLY
@router.post("/create_user_manually",
             description= "Create user with request body consisting user email, password and username"
             )
async def create_user_manually(request : Request):
    request = await request.json()
    res = ""
    try:
        res = auth.get_user_by_email(request['email'])
    except Exception as e:
        print(e)
    
    if(res):
        auth.delete_user(res.uid)
        
    user = auth.create_user(
        email=request['email'],
        email_verified=False,
        password=request['password'],
        display_name=request['username'],
        disabled=False
        )

    db.collection(u'users').document(user.uid).delete()

    create_user(user.uid, request['username'], request['email'])

    returnObj = {
        "uid" : user.uid,
        "username": request['username'],
        "email": request['email'],
        "jwtToken": signJWT(user.uid)['access_token']
    }
    return returnObj


# FOR TESTING PURPOSES ONLY
@router.post("/create_admin_user",
            description= "create admin user with non-expiring JWT token. Depricate soon."
             )
async def create_user_manually(request : Request):
    request = await request.json()
    res = ""
    print(request)
    try:
        res = auth.get_user_by_email(request['email'])
    except Exception as e:
        print(e)
    
    if(res):
        auth.delete_user(res.uid)
        
    user = auth.create_user(
        email=request['email'],
        email_verified=False,
        password=request['password'],
        display_name=request['username'],
        disabled=False
        )

    res = create_user(user.uid, request['username'], request['email'])

    returnObj = {
        "uid" : user.uid,
        "username": request['username'],
        "email": request['email'],
        "jwtToken": signAdminJWT(user.uid)['access_token']
    }

    return returnObj

@router.post("/admin/token/create",
             description= "Return admin token which never expires.")
async def generate_token(request: Request):
    try:
        request = await request.json()
        uid = request['uid']
        print(f"Generated JWT Token for User with UID: {uid} \n")
        return signAdminJWT(uid)
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, detail="Something went wrong")

@router.post("/token/create",
            description="Generate user JWT token after successful login."
             )
async def generate_token(request: Request,
                         ):
    request = await request.json()
    uid = request['uid']
    print(f"Generated JWT Token for User with UID: {uid} \n")

    return signJWT(uid) 

# This should actually be called user creation
@router.get("/token/verify", 
            dependencies=[Depends(JWTBearer())], 
            response_model=UserResponse,
            description="Validate JWT token in header in Bearer schema"
            )
async def generate_token(request: Request, uid = Depends(getUIDFromAuthorizationHeader)):
    try:
        user = user_dao.get(uid)
        print('Successfully fetched user data: {0}'.format(user.uid))
        # create_user(user.uid, user.display_name, user.email)
    
    except auth.UserNotFoundError:
        raise HTTPException(404, detail=f"User with UID = {uid} could not found")
 
    return user


# FOR TESTING PURPOSES ONLY
@router.post("/add_dummy_users",
             description= "For testing purposes: Populates firebase database with dummy users"
             )
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
@router.get("/", 
            response_model=List[UserResponse],
            description="Get all users from firebase database"
            )
async def get_all_users():
    users = user_dao.get_all()

    return users

@router.get("/get_current_user", 
            response_model=UserResponse, 
            dependencies=[Depends(JWTBearer)],
            description="Get current logged in user by getting user uid from authorization header" 
            )
async def get_current_user(uid = Depends(getUIDFromAuthorizationHeader)):
    user = user_dao.get(uid)
    if not user:
        raise HTTPException(404, detail=f"User {uid} not found") 

    return user

@router.get("/{uid}", 
            response_model=UserResponse,
            description="Get a specific user by uid in url" 
            )
async def get_user(uid: str):
    user = user_dao.get(uid)
    if not user:
        raise HTTPException(404, detail=f"User {uid} not found") 

    return user

## Update users endpoint
@router.put("/{uid}", 
            response_model=User,
            description="Update a user by their uid in the url" 
            )
async def update_user(uid: str, user: User = Body(...)):
    updated_user = user_dao.update(uid, user)
    if not updated_user:
        raise HTTPException(404, detail=f"User {uid} not found") 

    return updated_user
     
# Create users endpoints
'''
Create users assumes user has signed up through auth
'''

# Maybe add a user already exists check here to prevent duplicate adds
@router.post("/create/{uid}",
            description="Create a user by their uid. This endpoint is used for creating users\
                that were created through google OAuth." 
             )

async def create_user_from_auth(uid: str, userBody: User = Body(...)):
    try:
        user = auth.get_user(uid)
        print('Successfully fetched user data: {0}'.format(user.uid))
        username = userBody.username if not user.display_name else user.display_name
        create_user(user.uid, username, user.email)
    
    except auth.UserNotFoundError:
        raise HTTPException(404, detail="User not found") 
    
    return signJWT(uid)

# Delete endpoints
@router.delete('/delete/{uid}',
                description="Delete user by uid in url" 
               )
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
@router.delete('/delete_all',
                description="WARNING: Delete all users in firebase database." 
               )
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

