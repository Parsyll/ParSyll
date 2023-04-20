from pydantic import BaseModel, EmailStr, conlist
from typing import Union, List, Literal

class Person(BaseModel):
    name: str = ''
    email: str = ''
    isProf: bool = False


class Timing(BaseModel):
    location: str = ''
    start: str = '12:00 AM'
    end: str = '12:00 AM'
    day_of_week: str = ''
    attribute: Literal['lec', 'rec', 'lab', 'office hours', 'exam']


class OfficeHourTiming(Timing):
    instructor: Union[Person, None]    

class GradingScheme(BaseModel):
    A: conlist(int, min_items=1, max_items=2)
    B: conlist(int, min_items=1, max_items=2)
    C: conlist(int, min_items=1, max_items=2)
    D: conlist(int, min_items=1, max_items=2)
    F: conlist(int, min_items=1, max_items=2)

class CourseBase(BaseModel):
    name: str = ''
    instructors: List[Person] = []
    syllabus: str = ''
    office_hrs: List[OfficeHourTiming] = []
    ics_file: List[str] = []
    textbook: List[str] = []
    class_times: List[Timing] = []
    school: str = ''
    credit_hrs: int = 3
    grading_scheme: Union[GradingScheme, None]

class Course(CourseBase):
    id: str

class User(BaseModel):
    uid: str
    username: str
    email: Union[EmailStr, None] = None
    schools: List[str] = []

class UserResponse(User):
    courses: List[Course]


