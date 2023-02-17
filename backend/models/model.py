from pydantic import BaseModel
from typing import Union, List, Any

class Course(BaseModel):
    name: str = ''
    instructors: List[str] = []
    locations: List[Any] = []
    syllabus: str = ''
    class_times: List[str] = []
    office_hrs: List[str] = []
    ics_file: str = ''

class User(BaseModel):
    uid: str
    username: str
    email: Union[str, None] = None
    schools: List[str] = [] 
    # courses: List[Course] = []  ## will create courses collection in firestore instead



