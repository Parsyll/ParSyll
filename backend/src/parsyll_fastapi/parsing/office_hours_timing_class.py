from typing import Union
from person_class import Person
from timing_class import Timing

class OfficeHourTiming(Timing):

    def __init__(self, location: str = '', start: str = '', end: str = '', days_of_week: str = '',
                 attribute: str = 'office hours', instructor: Union[Person, None] = None):
                 
        super().__init__(location=location, start=start, end=end, days_of_week=days_of_week, attribute=attribute)
        self.instructor = instructor

