def process_days(days):
    # process a list of days of the week 
    if days:

        DOW_repr = { "Tu": "Tuesday", "Tue": "Tuesday", "Tues": "Tuesday", "Mon" : "Monday",
                    "Wed" : "Wednesday", "Thur" : "Thursday", "Th" : "Thursday", "Thurs" : "Thursday", 
                    "Fri" : "Friday", "Sat": "Saturday", "Sun": "Sunday", "Monday" : "Monday", "Tuesday" : "Tuesday",
                    "Wednesday" : "Wednesday", "Thurday" : "Thursday", "Friday" : "Friday", "Saturday" : "Saturday",
                    "Sunday" : "Sunday", "M":"Monday", "W":"Wednesday", "F":"Friday"
        }
        days = [DOW_repr[day] if DOW_repr.get(day, 0) else day for day in days]
        return days

