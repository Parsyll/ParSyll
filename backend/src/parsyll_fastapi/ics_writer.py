from pdf_parser import parse_gpt
from ics import Calendar, Event
from datetime import date
from datetime import datetime
from datetime import timedelta

# get current datetime
dt = datetime.today()
print('Datetime is:', dt)

# get day of week as an integer
today_day = datetime.now().weekday()
print('Day of the week is:', today_day)

DAYS_OF_WEEK = {"MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, 
                "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6}
                
response = parse_gpt('./etc/ie335_syllabus.pdf', 'prompts/class_timings2.txt')
print(response)
print(type(response))
# TODO: at the moment, not setting latitude and longitude of location, only adding location along
# with event name

# get start date for lecture in python datetime
day_diff = timedelta(days=0)
curr_day = DAYS_OF_WEEK[response[3].upper()]
if today_day > curr_day:
    day_diff = timedelta(days=today_day - curr_day)
elif today_day < curr_day:
    day_diff = timedelta(days=curr_day - today_day)

start_date = dt + day_diff

# add time to lecture start date
format = '%Y-%m-%d %I:%M%p'

start_date = start_date.strftime('%Y-%m-%d') + ' ' + response[1]

# TODO: Issue with timezone settings, need to add 5 hours right now since
# EST is 5 hours behind UTC

start_date = datetime.strptime(start_date, format) + timedelta(hours=5) 
print("lecture start date is: ", start_date)

c = Calendar()
e = Event()
e.name = f"{response[0]} ({response[4]})" #course number (location)
e.begin = start_date
e.duration = timedelta(minutes=int(response[2]))
# e.end = end_date
c.events.add(e)
c.events
# [<Event 'My cool event' begin:2014-01-01 00:00:00 end:2014-01-01 00:00:01>]
with open('my.ics', 'w') as my_file:
    my_file.writelines(c.serialize_iter())
# and it's done !


