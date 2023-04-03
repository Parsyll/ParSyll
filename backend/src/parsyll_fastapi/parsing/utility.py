import re

def process_time(self, time):
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



