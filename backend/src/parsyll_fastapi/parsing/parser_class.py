import PyPDF2
import openai
import os
import wandb
import nltk
import ssl
from nltk.corpus import stopwords
import re

from dotenv import load_dotenv
from ics import Calendar, Event
from datetime import date
from datetime import datetime
from datetime import timedelta

from parsyll_fastapi.models.model import Course
from parsyll_fastapi.parsing.regex_helper import RegexHelper


load_dotenv()  # take environment variables from .env.

# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context
# nltk.download('punkt')
# nltk.download('stopwords')

from nltk.tokenize import word_tokenize

DAYS_OF_WEEK = {"MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, 
    "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6}


# TODO: add default values to arguments
class Parser():
    def __init__(self, openai_key=None, pdf_file=None, prompt_file=None, 
                 temperature=None, max_tokens=None, gpt_model=None, 
                 DOW_promptfile=None):
        self.openai_key = openai_key
        self.pdf_file = pdf_file
        self.prompt_file = prompt_file
        self.DOW_promptfile = DOW_promptfile
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.gpt_model = gpt_model

        # stores the extracted text from the pdf as a string
        self.pdf_text = ''
        self.stopwords = set(stopwords.words())
        self.response = dict()


    def extract_text(self):
        pdf_file = open(self.pdf_file, 'rb')
        reader = PyPDF2.PdfReader(pdf_file)

        for i in range(len(reader.pages)):
            page = reader.pages[i]
            page_text = page.extract_text()
            self.pdf_text += page_text
        
        pdf_file.close()

    def remove_stopwords(self):
        if self.pdf_text:
            text_tokens = word_tokenize(self.pdf_text)
            tokens_without_sw = [word for word in text_tokens if not word in self.stopwords]
            self.pdf_text = " ".join(tokens_without_sw)
        
    # costly to have another api call, find better way
    def get_days_of_week(self):
        if self.response:
            # openai.api_key = self.openai_key

            # gpt_prompt =  self.DOW_promptfile + self.response['days_of_week']
            # response =  openai.Completion.create(
            #     model=self.gpt_model,
            #     prompt=f'{gpt_prompt}', 
            #     max_tokens=self.max_tokens,
            #     temperature=self.temperature,
            #     # stream=True
            # )

            # self.response['days_of_week'] = (response.choices[0].text).split(",")

            DOW_repr = { "Tu": "Tuesday", "Tue": "Tuesday", "Tues": "Tuesday", "Mon" : "Monday",
                        "Wed" : "Wednesday", "Thur" : "Thursday", "Th" : "Thursday", "Thurs" : "Thursday", 
                        "Fri" : "Friday", "Sat": "Saturday", "Sun": "Sunday", "Monday" : "Monday", "Tuesday" : "Tuesday",
                        "Wednesday" : "Wednesday", "Thurday" : "Thursday", "Friday" : "Friday", "Saturday" : "Saturday",
                        "Sunday" : "Sunday", "M":"Monday", "W":"Wednesday", "F":"Friday"
            }
            res_set = set()
            for key in DOW_repr.keys():
                if key in self.response['days_of_week']:
                    res_set.add(DOW_repr[key]) 

            self.response['days_of_week'] = list(res_set)

    # puts together the different methods in the preprocessing pipeline
    def preprocess(self):
        self.extract_text()
        self.remove_stopwords()

    def postprocess(self):
        self.get_days_of_week()

    def gpt_parse(self):
        # pre-processing
        self.preprocess()

        openai.api_key = self.openai_key

        with open(self.prompt_file, 'r') as file:
            prompt_text = file.read().replace('\n', '')

        # ensure text to parsed does not exceed model's maximum 
        # content length (1 token is abour 4 chars)
        if self.pdf_text:
            pdf_text = self.pdf_text[0:min(len(self.pdf_text), 8000)]

        gpt_prompt = pdf_text + prompt_text
        response = openai.Completion.create(
                model=self.gpt_model,
                prompt=f'{gpt_prompt}', 
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                # stream=True
            )
  
        print(response)
        response = (response.choices[0].text.replace("-",",")).split(",")

        start_time = RegexHelper().format_time(response[1])
        end_time = RegexHelper().format_time(response[2])

        if start_time and end_time:
            print(start_time.group(), end_time.group())
        else:
            print(start_time, end_time)

        self.response['course'] = response[0]
        self.response['class_start_time'] = "" if not start_time else start_time.group()
        self.response['class_end_time'] = "" if not end_time else end_time.group()
        self.response['days_of_week'] = response[3]
        self.response['class_location'] = response[4]
        self.response['prof_name'] = response[5]
        
        self.postprocess()

    def write_ics(self, courseObj: Course = None):

        if (self.response and self.response['days_of_week']) or courseObj:
            if self.response:
                days_of_week = self.response['days_of_week']
                course = self.response['course']
                class_location = self.response['class_location']
                class_start_time = self.response['class_start_time']
                class_end_time = self.response['class_end_time']
            else:
                days_of_week = courseObj.days_of_week
                course =  courseObj.name
                class_location = courseObj.locations
                class_start_time = courseObj.class_start
                class_end_time = courseObj.class_end

            c = Calendar() # Calendar object

            # get current datetime
            dt = datetime.today()

            # get day of week as an integer
            today_day = datetime.now().weekday()

            for i in range(len(days_of_week)):
                day_diff = timedelta(days=0)
                curr_day = DAYS_OF_WEEK[days_of_week[i].upper()]
                if today_day > curr_day:
                    day_diff = timedelta(days=today_day - curr_day)
                elif today_day < curr_day:
                    day_diff = timedelta(days=today_day - curr_day + 7)

                start_date = dt + day_diff

                # add time to lecture start date
                format = '%Y-%m-%d %I:%M %p'
                
                # add start time to current start_date

                start_time = re.search(r"([0-9]{,2}\s*:\s*[1-9]{,2})\s*(pm|am)", class_start_time)
                end_time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", class_end_time)

                if start_time:
                    start_time = start_time.groups()
                else:
                    start_time = ("10:00", "am")
                
                if end_time:
                    end_time = end_time.groups()
                else:
                    end_time = ("11:00", "am")


                start_time = start_date.strftime('%Y-%m-%d') + ' ' + start_time[0] + ' ' + start_time[1]
                end_time = start_date.strftime('%Y-%m-%d') + ' ' + end_time[0] + ' ' + end_time[1]


                # TODO: Issue with timezone settings, need to add 5 hours right now since
                # EST is 5 hours behind UTC
                start_time = datetime.strptime(start_time, format) + timedelta(hours=5) 
                end_time = datetime.strptime(end_time, format) + timedelta(hours=5) 

                # # end date 
                # end_date = start_date + timedelta(minutes=int(self.response['class_duration']))

                e = Event()
                e.begin = start_time
                e.location = "" if not class_location else class_location[0]
                e.name = f"{course} lecture" #course number (location)
                # e.duration = timedelta(minutes=int(self.response['class_duration']))
                e.end = end_time
                c.events.add(e)
            
            # c.events
            with open('my.ics', 'w') as my_file:
                my_file.writelines(c.serialize_iter())
                self.response['ics'] = c.serialize_iter()

            current_month = (datetime.today() + timedelta(weeks=16)).strftime('%Y%m%d')
            repeat_weekly = f"RRULE:FREQ=WEEKLY;UNTIL={current_month}T000000Z\r\n"

            ics_with_repeat = []
            for i, s in enumerate(self.response['ics']):
                ics_with_repeat.append(s)
                if "DTSTART" in s:
                    ics_with_repeat.append(repeat_weekly)
            
            self.response['ics'] = ics_with_repeat
        else:
            self.response['ics'] = []
            return
