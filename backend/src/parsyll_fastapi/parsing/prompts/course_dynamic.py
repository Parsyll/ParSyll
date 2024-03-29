from parsyll_fastapi.models.model import *
from uuid import uuid4
import textwrap


instructor = Person(name="Santiago", email="santiago@purdue.edu", isProf=True)
TA = Person(name="Teaching Assistant", email="TA@purdue.edu", isProf=False)

lec1 = Timing(
    location="EE 117",
    start="4:30 PM",
    end="5:20 PM",
    day_of_week="Monday",
    attribute="lec",
)
lec2 = Timing(
    location="EE 206",
    start="9:30 AM",
    end="11:20 AM",
    day_of_week="Thursday",
    attribute="lec",
)

textbook = Misc(tag='textbook', value='how to code 101')


course_example = CourseBase(
    name="ECE 49595O",
    instructors=[instructor, TA],
    syllabus=str(uuid4()),
    class_times=[lec1, lec2],
    school="Purdue University",
    credit_hrs=4,
    miscs=[textbook],
)


prompt_text = (
    f''' 
        The previous text was taken from a page of a college course syllabus.
        Could you please parse the syllabus for the following information:
        {CourseBase().dict().keys()}

        In a format like this example:
        {course_example.dict()}

        If multiple days of week are detected, please append a new entry to the 'class_times' key.
        Please also limit the class_time attributes to "lec", "rec", "lab", and "oh". 
        "lec" = "lecture", "rec" = "recitation", "lab" = "lab", and "oh" = "office hours".

        Give only this information, no other wording or explanation please. 
    '''
)


prompt_text = textwrap.dedent(prompt_text)
