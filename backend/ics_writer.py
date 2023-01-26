from pdf_parser import parse_gpt
from ics import Calendar, Event
from datetime import date
from datetime import datetime

# get current datetime
dt = datetime.now()
print('Datetime is:', dt)

# get day of week as an integer
x = dt.weekday()
print('Day of a week is:', x)

DAYS_OF_WEEK = ["MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, 
                "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6]
                
# response = parse_gpt('./etc/ie335_syllabus.pdf', 'prompts/class_timings2.txt')
# print(response)
# print(type(response))
# # TODO: at the moment, not setting latitude and longitude of location, adding location along
# # with event name

# c = Calendar()
# e = Event()
# e.name = f"{response[0]} ({response[3]})" #course number (location)
# e.begin = '2023-01-01 00:00:00'
# e.end = '2023-01-01 10:00:00'
# c.events.add(e)
# c.events
# # [<Event 'My cool event' begin:2014-01-01 00:00:00 end:2014-01-01 00:00:01>]
# with open('my.ics', 'w') as my_file:
#     my_file.writelines(c.serialize_iter())
# # and it's done !


