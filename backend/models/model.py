from pydantic import BaseModel
from typing import Union, List, BinaryIO

class Course(BaseModel):
    name: str
    instructors: List[str]
    location: Union[str, None] = None

class User(BaseModel):
    uid: str
    username: str
    email: Union[str, None] = None
    # syllabus: List[BinaryIO] = None
    school: Union[str, None] = None
    courses: List[Course] = None



