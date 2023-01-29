import firebase_admin
import pyrebase
import json

from firebase_admin import credentials, auth, firestore

cred = credentials.Certificate("service_account.json")
firebase_admin.initialize_app(cred)
config = json.load(open('firebase_config.json'))
pb = pyrebase.initialize_app(config)
db = firestore.client()
