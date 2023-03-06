import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

# cred3312412343434313232
print(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
print(os.getenv("FIREBASE_CONFIG"))
cred = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
config = json.loads(os.getenv("FIREBASE_CONFIG"))


cred = credentials.Certificate(cred)
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
# config = json.load(open(config_path))
config = config
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
