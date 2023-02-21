import firebase_admin
import pyrebase
import json

from firebase_admin import credentials, auth, firestore, storage

cred = credentials.Certificate("service_account.json")
firebase_admin.initialize_app(cred, {'storageBucket': 'parsyll.appspot.com'})
config = json.load(open('firebase_config.json'))
pb = pyrebase.initialize_app(config)
db = firestore.client()
bucket = storage.bucket()
