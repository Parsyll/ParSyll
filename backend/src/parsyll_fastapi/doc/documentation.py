doc_description = """
We aim to automate your early semester syllabus reading through an easy-to-access dashboard. ParSyll parses key information from your syllabus such as class times, instructor information, locations and more!

## Goals:
- Allow students to upload their syllabus and generate a downloadable calendar.
- Display important information about instructor and course.


"""
doc_contact= {
    "name": "Kenneth Wong Hon Nam",
    "email": "cankennethwong@gmail.com",
}

doc_license_info= {
    "name": "Apache 2.0",
    "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
}

doc_version = "0.0.1"


doc_tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users CRUD and also user verification via JWT. This endpoint also handles\
            user information retrievel from firebase. You will need a firebase database and credentials to handle the users.",
    },
    {
        "name": "pdfs",
        "description": "This api route is for handling user PDF CRUD when they submit a PDF for parsing.",
    },
    {
        "name": "courses",
        "description": "This API route is to handle course CRUD, the endpoints here tend to be called in tandem with api endpoints from \
            pdfs as pdf ids are tied to the courses object.",
    },
    {
        "name": "create_course",
        "description": 
            "This API endpoint is for course creation."
    },
]