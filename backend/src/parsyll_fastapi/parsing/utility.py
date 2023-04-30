import re
import string

# from datetime import date
from datetime import datetime
from datetime import timedelta
from ics import Calendar, Event
from parsyll_fastapi.models.model import Timing

def add_ics_event(c, today_day, dt, timing, course_name):
    '''
    Inputs:
    1. c - the Calendar object to which we add the event
    2. today_day - today's day of week as an integer
    3. dt - today's datetime object
    4. timing - the timing object from which we have to create an event 
    5. course_name - (e.g : ECE 20001)

    Return:
    1. c - the updated calendar object
    '''
    # get start date of event
    start_date = get_start_date(timing.day_of_week, today_day, dt)

    # add start time to current start_date
    start_time, end_time = process_time(timing.start, split=True), process_time(timing.end, split=True)

    # start_time = start_time.groups() if start_time else ("10:00", "am")
    # end_time = end_time.groups() if end_time else ("11:00", "am")

    start_time = add_time_to_date(date=start_date, time=start_time, adjustment=4)
    end_time = add_time_to_date(date=start_date, time=end_time, adjustment=4)
    
    timing.attribute = timing.attribute.lower() if timing.attribute else "lec"
    
    if timing.attribute.lower() == 'lec':
        event_name = f'{course_name} Lecture'

    elif timing.attribute.lower() == 'oh':
        event_name = f'{course_name} Office Hours'
    
    elif timing.attribute.lower() == 'rec':
        event_name = f'{course_name} Recitation'
        
    elif timing.attribute.lower() == 'lab':
        event_name = f'{course_name} Lab'
        
    e = create_ics_event(event_name, start_time, end_time, timing.location)
    c.events.add(e)

    return c

def create_ics_event(event_name, start_time, end_time, location):
    '''
    Inputs:
    1. event_name - name of the calendar event
    2. start_time - event start time in '%Y-%m-%d %I:%M %p' format
    3. end_time - event end time in '%Y-%m-%d %I:%M %p' format
    4. location - event location

    Return:
    1. e - the ICS calendar event
    '''
    e = Event()
    e.begin = start_time
    e.location = "" if not location else location
    e.name = event_name
    e.end = end_time

    return e

def add_time_to_date(date, time, adjustment):
    '''
    Inputs: 
    1. date - date in '%Y-%m-%d' format (datetime object)
    2. time - the time to be added to the date (e.g : 11:00)
    3. meridiem - am/pm specification for the time
    4. adjustment - hour timedelta to be added to the date
                    to adjust for the UTC timezone issue

    Return:
    1. date - the updated datetime object with format: '%Y-%m-%d %I:%M %p'
              (time and adjustment have been added to date)
    '''
    format = '%Y-%m-%d %I:%M %p'

    date = date.strftime('%Y-%m-%d') + ' ' + time
    print(f"Before date: {date}")
    date = datetime.strptime(date, format) + timedelta(hours=adjustment) 
    print(f"After date: {date}")

    return date

def get_offset_to_next_calendar_day(curr_day, target_day):
    offset = 0
    while curr_day != target_day:
        curr_day = (curr_day + 1) % 7
        offset += 1
    
    return offset
    

def get_start_date(day_of_week, today_day, dt):
    '''
    Inputs:
    1. day_of_week - day of week of the event for which we need to 
                     find the start date. If not found the value is "0"
                     so we default to Monday

    2. today_day - today's day of the week as an integer

    3. dt - current datetime object to which we add the day_diff

    Return:
    1. start_date - updated dt to include the correct start date.
    '''

    DAYS_OF_WEEK = {"0": 0, "MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, 
    "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6}

    day_diff = timedelta(days=0)
    
    dow_enum = DAYS_OF_WEEK.get(day_of_week.upper(), 0)

    # if today_day > dow_enum:
    #     day_diff = timedelta(days=today_day - dow_enum)
    # elif today_day < dow_enum:
    #     day_diff = timedelta(days=today_day - dow_enum + 7)

    day_diff = timedelta(get_offset_to_next_calendar_day(today_day, dow_enum))

    start_date = dt + day_diff

    print(f"today_day: {today_day}, day_of_week: {day_of_week} dt: {dt}")
    print(f"day_diff: {day_diff} start_date: {start_date}")

    return start_date

def is_valid_time_string(time_string):
    try:
        # AM/PM format
        datetime.strptime(str(time_string), '%I:%M %p')
        return True
    except ValueError:
        return False

def process_time(time, split=False):
    # time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", time)
    if is_valid_time_string(time):
        return time

    if not time:
        time = "12:00 AM"

    time = re.search(r"([0-9]{,2})\s*:\s*([0-9]{,2})\s*(pm|am)", time)
    
    if time:
        time = time.groups()
    else:
        time = ("12", "00", "AM")

    hours = time[0] if time[0] else "12"

    if len(hours) < 2:
        hours = "0" + hours #In the case where we get a single digit
        
    label = time[2].upper() if time[2] else "AM"
    minutes = time[1] if time[1] else "00"
    time = hours + ":" + minutes + " " + label

    if split:
        return (hours+":"+minutes, label)

    # if time not valid set to default time
    if not is_valid_time_string(time):
        time = "12:00 AM"

    return time

def strip_punctuation_and_whitespace(s):
    """Remove all punctuation and whitespace characters from a string."""
    # Create a translation table that maps all punctuation and whitespace
    # characters to None
    translation_table = str.maketrans('', '', string.punctuation + string.whitespace)
    # Use the translation table to remove all punctuation and whitespace
    return s.translate(translation_table)

def process_day_of_week(day):

    DOW_repr = {
        "M": "Monday",
        "MON": "Monday",
        "MONDAY": "Monday",
        "TU": "Tuesday",
        "TUE": "Tuesday",
        "TUES": "Tuesday",
        "TUESDAY": "Tuesday",
        "W": "Wednesday",
        "WED": "Wednesday",
        "WEDNESDAY": "Wednesday",
        "TH": "Thursday",
        "THU": "Thursday",
        "THUR": "Thursday",
        "THURS": "Thursday",
        "THURSDAY": "Thursday",
        "F": "Friday",
        "FRI": "Friday",
        "FRIDAY": "Friday",
        "SAT": "Saturday",
        "SATURDAY": "Saturday",
        "SUN": "Sunday",
        "SUNDAY": "Sunday"
    }

    # default to monday if invalid/empty string
    if not day:
        return "Monday"

    day = strip_punctuation_and_whitespace(day)
    
    if day.upper() not in DOW_repr:
        print(f"day={day.upper()} not in DOW_repr")
        return "Monday"

    day = DOW_repr[day.upper()]

    return day


def process_class_timings(class_times):
    new_class_times = []
    for class_time in class_times:
        new_class_time = Timing()
        new_class_time.location = class_time.location
        new_class_time.start = process_time(class_time.start)
        new_class_time.end = process_time(class_time.end)
        new_class_time.day_of_week = process_day_of_week(class_time.day_of_week)
        new_class_time.attribute = class_time.attribute
        
        new_class_times.append(new_class_time)

    return new_class_times        


# def process_office_hours(office_hour):
#     # processes one office hour timing for one instructor
#     # input: office_hour = 'Name, Start Time, End Time, Day1 Day2, Location'
#     # return: [
#     #           ['Name', 'Start Time', 'End Time', 'Day1', 'Location'], 
#     #           ['Name', 'Start Time', 'End Time', 'Day2', 'Location']
#     #           ]

#     office_hour = office_hour.split(",")

#     length = len(office_hour)
#     if length > 5: # clip to first 5 values
#         office_hour = office_hour[:5]
#     elif length < 5:
#         for i in range(5 - length):
#             office_hour.append('0')

#     office_hour[3] = office_hour[3].split(" ")
#     office_hour[3] = process_days(office_hour[3])

#     res = []
#     for day in office_hour[3]:
#         res.append([office_hour[0], office_hour[1], office_hour[2], day, office_hour[4]])
    
#     return res



