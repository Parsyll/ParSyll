import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage
from dotenv import load_dotenv

load_dotenv()

cred = str(os.getenv("FIREBASE_SERVICE_ACCOUNT")).strip("'<>() ").replace('\'', '\"')
config = str(os.getenv("FIREBASE_CONFIG")).strip("'<>() ").replace('\'', '\"')
with open(cred, "r") as file:
    cred1 = file.read()

with open(config, "r") as file:
    config1 = file.read()

cred = json.loads(cred1)
config = json.loads(config1)


cred = credentials.Certificate(cred)
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
# config = json.load(open(config_path))
config = config
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
