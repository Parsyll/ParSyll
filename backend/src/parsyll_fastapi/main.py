import uvicorn
import time
 
from fastapi import FastAPI, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from parsyll_fastapi.routers import users, pdfs, courses

from parsyll_fastapi.doc.documentation import doc_description, doc_contact, doc_license_info, doc_version, doc_tags_metadata


app = FastAPI(
    title="Parsyll",
    version= doc_version,
    description=doc_description,
    contact=doc_contact,
    license_info= doc_license_info,
    openapi_tags=doc_tags_metadata
)
app.include_router(users.router)
app.include_router(pdfs.router)
app.include_router(courses.router)

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
    expose_headers=['Content-Disposition']
)


async def handle_exceptions(request: Request, call_next):
    try:
        response = await call_next(request)
        return response
    
    except HTTPException as e:
        # raise HTTPException(e.status_code, detail=e.detail)
        return JSONResponse(status_code=e.status_code, content={"detail": str(e.detail)})

    except Exception as e:
        import traceback
        print(f"Error: {e}")
        print(f"Error Type: {type(e)}")
        print(f"from path {request.url.path}")
        # print(f"Stack trace: {traceback.format_exception(etype=type(e), value=e, tb=e.__traceback__)}")
        # raise HTTPException(500, detail="Something went wrong")
        return JSONResponse(status_code=500, content={"detail": str(e)})


async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f"This request took {process_time} seconds")
    return response

app.middleware("http")(handle_exceptions)
app.middleware("http")(add_process_time_header)

# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

if __name__ == "__main__":
   uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)




