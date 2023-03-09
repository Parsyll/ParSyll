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


# TODO: add default values to arguments
class Parser():
    def __init__(self, openai_key, pdf_file, prompt_file, 
                 temperature, max_tokens, gpt_model, 
                 DOW_promptfile):
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

        self.response['course'] = response[0]
        self.response['class_start_time'] = response[1]
        self.response['class_end_time'] = response[2]
        self.response['days_of_week'] = response[3]
        self.response['class_location'] = response[4]
        self.response['prof_name'] = response[5]
        
        self.postprocess()

    def write_ics(self):
        if self.response:

            # get current datetime
            dt = datetime.today()

            # get day of week as an integer
            today_day = datetime.now().weekday()

            DAYS_OF_WEEK = {"MONDAY": 0, "TUESDAY": 1, "WEDNESDAY": 2, 
                "THURSDAY": 3, "FRIDAY": 4, "SATURDAY": 5, "SUNDAY": 6}
            
            c = Calendar()

            # get start date for lecture in python datetime
            # print(self.response)
            if not self.response['days_of_week']:
                self.response['ics'] = []
                return None
            
            for i in range(len(self.response['days_of_week'])):
                day_diff = timedelta(days=0)
                curr_day = DAYS_OF_WEEK[self.response['days_of_week'][i].upper()]
                if today_day > curr_day:
                    day_diff = timedelta(days=today_day - curr_day)
                elif today_day < curr_day:
                    day_diff = timedelta(days=today_day - curr_day + 7)

                start_date = dt + day_diff

                # add time to lecture start date
                format = '%Y-%m-%d %I:%M %p'
                
                # add start time to current start_date

                start_time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", self.response['class_start_time'])
                end_time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", self.response['class_end_time'])

                if start_time:
                    start_time = start_time.groups()
                else:
                    start_time = ("10:00", "am")
                
                if end_time:
                    end_time = end_time.groups()
                else:
                    end_time = ("11:00", "am")


                start_time = start_date.strftime('%Y-%m-%d') + ' ' + start_time[0] + ' ' + start_time[1]
                print(start_time, curr_day)
                end_time = start_date.strftime('%Y-%m-%d') + ' ' + end_time[0] + ' ' + end_time[1]


                # TODO: Issue with timezone settings, need to add 5 hours right now since
                # EST is 5 hours behind UTC
                start_time = datetime.strptime(start_time, format) + timedelta(hours=5) 
                end_time = datetime.strptime(end_time, format) + timedelta(hours=5) 

                # # end date 
                # end_date = start_date + timedelta(minutes=int(self.response['class_duration']))

                e = Event()
                e.name = f"{self.response['course']} ({self.response['class_location']})" #course number (location)
                e.begin = start_time
                e.location = "" if not self.response['class_location'] else self.response['class_location'][0]
                # e.duration = timedelta(minutes=int(self.response['class_duration']))
                e.end = end_time
                c.events.add(e)
            
            # c.events
            with open('my.ics', 'w') as my_file:
                my_file.writelines(c.serialize_iter())
                self.response['ics'] = c.serialize_iter()

            
            repeat_weekly = "RRULE:FREQ=WEEKLY;UNTIL=20240101T000000Z\r\n"
            done = []
            for i, s in enumerate(self.response['ics']):
                done.append(s)
                if "DTSTART" in s:
                    done.append(repeat_weekly)
            
            print(done)
            self.response['ics'] = done
            # print(self.response['ics'])