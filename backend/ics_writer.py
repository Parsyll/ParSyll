from pdf_parser import parse_gpt
from ics import Calendar, Event
from datetime import date

# get today's date and add events for today's week and onwards
today = date.today() # "2023-01-24"

response = parse_gpt('./etc/ie335_syllabus.pdf', 'prompts/class_timings2.txt')

# TODO: at the moment, not setting latitude and longitude of location, adding location along
# with event name

c = Calendar()
e = Event()
e.name = f"{response['courseNum'](response['location'])}" #course number (location)
e.begin = '2023-01-01 00:00:00'
e.end = '2023-01-01 10:00:00'
c.events.add(e)
c.events
# [<Event 'My cool event' begin:2014-01-01 00:00:00 end:2014-01-01 00:00:01>]
with open('my.ics', 'w') as my_file:
    my_file.writelines(c.serialize_iter())
# and it's done !


