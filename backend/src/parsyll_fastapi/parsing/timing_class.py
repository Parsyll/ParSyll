from typing import Literal

class Timing():

    def __init__(self, location: str = '', start: str = '', end: str = '', days_of_week: str = '',
                 attribute: Literal['lec', 'rec', 'lab', 'office hours', 'exam'] = 'lec'):
        self.location = location
        self.start = start
        self.end = end
        self.days_of_week = days_of_week
        self.attribute = attribute

        