import requests
import os
import random

print(os.getcwd())
url = 'http://localhost:8000/pdfsubmit'


filepath = "./1.pdf"

with open("./1.pdf", "rb") as fobj:
    file_obj = fobj.read()
    file_basename = os.path.basename(filepath)
    file_to_upload = {"file": (str(file_basename), file_obj)}
    finfo = {"fullPath": filepath}
    upload_response = requests.post(url, files=file_to_upload, data=finfo)
    print(upload_response.json())
    fobj.close()

# file = {'file': open('./requirements.txt', 'rb').read()}
# resp = requests.post(url=url, files=file) 
# print(resp.json())