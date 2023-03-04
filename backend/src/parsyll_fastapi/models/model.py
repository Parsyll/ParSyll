from pydantic import BaseModel, EmailStr
from typing import Union, List, Any, Dict

class Course(BaseModel):
    name: str = ''
    instructors: List[str] = []
    locations: List[str] = []
    syllabus: str = ''
    class_start: str = ''
    class_end: str = ''
    days_of_week: List[str] = []
    office_hrs: List[Any] = []
    ics_file: List[str] = []
    textbook: str = ''

class User(BaseModel):
    uid: str
    username: str
    email: Union[EmailStr, None] = None
    schools: List[str] = [] 
    # courses: List[Course] = []  ## will create courses collection in firestore instead



