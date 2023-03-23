import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

cred = str(os.getenv("FIREBASE_SERVICE_ACCOUNT")).strip("'<>() ").replace("'", '"')
config = str(os.getenv("FIREBASE_CONFIG")).strip("'<>() ").replace("'", '"')

cred = json.loads(cred)
config = json.loads(config)


cred = credentials.Certificate(cred)
firebase_admin.initialize_app(cred, {"storageBucket": "parsyll.appspot.com"})
# config = json.load(open(config_path))
config = config
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
