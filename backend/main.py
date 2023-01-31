import uvicorn
 
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from routers import users

app = FastAPI()
app.include_router(users.router)

origins = [
    "http://localhost:3001"
]

allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)


# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

# pdf submission endpoint
@app.post("/pdfsubmit")
async def upload_file(file: UploadFile):
    #useful links: 
    # https://stackoverflow.com/questions/64168340/how-to-send-a-file-docx-doc-pdf-or-json-to-fastapi-and-predict-on-it-without
    # https://fastapi.tiangolo.com/tutorial/request-files/

    return {"filename": file.filename}

if __name__ == "__main__":
   uvicorn.run("main:app")




