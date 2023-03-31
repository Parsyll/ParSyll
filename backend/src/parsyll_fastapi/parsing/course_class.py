from typing import List, Union

from timing_class import Timing
from person_class import Person
from grading_scheme_class import GradingScheme
from office_hours_timing_class import OfficeHourTiming

class CourseInfo:
    def __init__(self, name: str = '', instructors: List[Person] = [], syllabus: str = '',
                 office_hrs: List[OfficeHourTiming] = [], ics_file: List[str] = [],
                 textbook: List[str] = [], class_times: List[Timing] = [],
                 school: str = '', credit_hrs: int = 3,
                 grading_scheme: Union[GradingScheme, None] = None):
        self.name = name
        self.instructors = instructors
        self.syllabus = syllabus
        self.office_hrs = office_hrs
        self.ics_file = ics_file
        self.textbook = textbook
        self.class_times = class_times
        self.school = school
        self.credit_hrs = credit_hrs
        self.grading_scheme = grading_scheme