import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

cred_path = os.path.join(os.path.join(os.path.dirname(__file__), os.getenv("FIREBASE_SERVICE_ACCOUNT")))
config_path = os.path.join(os.path.join(os.path.dirname(__file__), os.getenv("FIREBASE_CONFIG")))

cred = credentials.Certificate(cred_path)
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
config = json.load(open(config_path))
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
