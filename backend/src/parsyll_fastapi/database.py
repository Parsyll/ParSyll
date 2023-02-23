import firebase_admin
import pyrebase
import json
import os

from firebase_admin import credentials, auth, firestore, storage

cred = credentials.Certificate(os.path.join(os.path.dirname(__file__), "service_account.json"))
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
config = json.load(open(os.path.join(os.path.dirname(__file__), "firebase_config.json")))
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
