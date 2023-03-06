import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

# cred331241234343
cred_path = json.loads(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
config_path = json.loads(os.getenv("FIREBASE_CONFIG"))


cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
# config = json.load(open(config_path))
config = config_path
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
