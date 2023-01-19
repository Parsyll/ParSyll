from pydantic import BaseModel
from typing import Union, List

class Course(BaseModel):
    name: str
    instructors: List[str]
    location: Union[str, None] = None

class User(BaseModel):
    username: str
    email: Union[str, None] = None
    courses: List[Course] = None



