import uvicorn
 
from fastapi import FastAPI, UploadFile, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import users
from routers import pdfs

app = FastAPI()
app.include_router(users.router)
app.include_router(pdfs.router)

origins = [
    "http://localhost:3000"
]


allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)

@app.middleware("http")
async def handle_exceptions(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    
    except HTTPException as e:
        raise HTTPException(e.status_code, detail=e.detail)

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(500, detail="Something went wrong")

# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

if __name__ == "__main__":
   uvicorn.run("main:app")




