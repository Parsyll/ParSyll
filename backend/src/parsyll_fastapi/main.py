import uvicorn
 
from fastapi import FastAPI, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from parsyll_fastapi.routers import users
from parsyll_fastapi.routers import pdfs

from starlette.responses import JSONResponse, Response


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
   allow_headers=allow_all,
)

@app.middleware("http")
async def handle_exceptions(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    
    except HTTPException as e:
        # raise HTTPException(e.status_code, detail=e.detail)
        return JSONResponse(status_code=e.status_code, content={"detail": str(e.detail)})

    except Exception as e:
        print(f"Error: {e}")
        # raise HTTPException(500, detail="Something went wrong")
        return JSONResponse(status_code=500, content={"detail": str(e)})

# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

if __name__ == "__main__":
   uvicorn.run("main:app", reload=True)



