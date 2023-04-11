import re

from datetime import date
from datetime import datetime
from datetime import timedelta
from ics import Calendar, Event

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
    start_time, end_time = process_time(timing.start), process_time(timing.end)

    start_time = start_time.groups() if start_time else ("10:00", "am")
    end_time = end_time.groups() if end_time else ("11:00", "am")

    start_time = add_time_to_date(date=start_date, time=start_time[0], meridiem=start_time[1], adjustment=5)
    end_time = add_time_to_date(date=start_date, time=end_time[0], meridiem=end_time[1], adjustment=5)
    
    if timing.attribute == 'lec':
        event_name = f'{course_name} Lecture'

    elif timing.attribute == 'office hours':
        event_name = f'{course_name} Office Hours {timing.instructor.name}'
    
    else:
        event_name = f'{course_name}'
        
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

def add_time_to_date(date, time, meridiem, adjustment):
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

    date = date.strftime('%Y-%m-%d') + ' ' + time + ' ' + meridiem
    date = datetime.strptime(date, format) + timedelta(hours=adjustment) 

    return date

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
    curr_day = DAYS_OF_WEEK[day_of_week.upper()]
    if today_day > curr_day:
        day_diff = timedelta(days=today_day - curr_day)
    elif today_day < curr_day:
        day_diff = timedelta(days=today_day - curr_day + 7)

    start_date = dt + day_diff

    return start_date

def process_time(time):
    time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", time)
    return time

def process_days(days):
    # process a list of days of the week 
    # input: days = ["Tue", "Wed", "TuTh"]
    # output: ["Tuesday", "Wednesday", "0"]
    if days:
        days = [day.upper() for day in days]
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

        days = [DOW_repr[day] if DOW_repr.get(day, 0) else "0" for day in days]
        return days

def process_office_hours(office_hour):
    # processes one office hour timing for one instructor
    # input: office_hour = 'Name, Start Time, End Time, Day1 Day2, Location'
    # return: [
    #           ['Name', 'Start Time', 'End Time', 'Day1', 'Location'], 
    #           ['Name', 'Start Time', 'End Time', 'Day2', 'Location']
    #           ]

    office_hour = office_hour.split(",")

    length = len(office_hour)
    if length > 5: # clip to first 5 values
        office_hour = office_hour[:5]
    elif length < 5:
        for i in range(5 - length):
            office_hour.append('0')

    office_hour[3] = office_hour[3].split(" ")
    office_hour[3] = process_days(office_hour[3])

    res = []
    for day in office_hour[3]:
        res.append([office_hour[0], office_hour[1], office_hour[2], day, office_hour[4]])
    
    return res



