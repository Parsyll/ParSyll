import PyPDF2
import openai
import os
import wandb
import nltk
import ssl
from nltk.corpus import stopwords
import re
import tiktoken

from dotenv import load_dotenv
from ics import Calendar, Event
from datetime import date
from datetime import datetime
from datetime import timedelta

from utility import process_days

from parsyll_fastapi.models.model import Course, Timing, CourseBase
from parsyll_fastapi.parsing.regex_helper import RegexHelper

# from course_class import CourseInfo
# from timing_class import Timing
# from person_class import Person
# from grading_scheme_class import GradingScheme
# from office_hours_timing_class import OfficeHourTiming


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
                 temperature=None, max_tokens_completion=None, max_tokens_context = None, 
                 gpt_model=None, DOW_promptfile=None, OH_prompt=None):
        self.openai_key = openai_key
        self.pdf_file = pdf_file
        self.prompt_file = prompt_file
        self.OH_prompt = OH_prompt
        self.DOW_promptfile = DOW_promptfile
        self.temperature = temperature
        self.max_tokens_completion = max_tokens_completion
        self.max_tokens_context = max_tokens_context
        self.gpt_model = gpt_model

        # stores the extracted text from the pdf as a string
        self.pdf_text = ''
        self.stopwords = set(stopwords.words())
        self.response = dict()

        self.course = CourseBase()

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
        

    def get_num_tokens(self, text=None, file=None):
        if file:
            with open(file, 'r') as file1:
                text = file1.read()
        
        encoding = tiktoken.get_encoding("gpt2")
        tokens = encoding.encode(text)
        return len(tokens), tokens, encoding

    def text_to_chunks(self, prompt_file, chunk_size=2000, overlap=100):

        # max tokens context >= prompt tokens + chunk tokens + completion tokens
        chunk_size = self.max_tokens_context - self.max_tokens_completion - (self.get_num_tokens(file=prompt_file))[0]
        print(chunk_size)
        num_pdf_tokens, tokens, encoding = self.get_num_tokens(text=self.pdf_text)

        chunks = []
        for i in range(0, num_pdf_tokens, chunk_size - overlap):
            chunk = tokens[i:i + chunk_size]
            chunks.append(chunk)
        
        print(len(chunks))
        chunks = [encoding.decode(chunk) for chunk in chunks]
        return chunks

    # puts together the different methods in the preprocessing pipeline
    def preprocess(self):
        self.extract_text()
        self.remove_stopwords()

    # def postprocess(self):
    #     self.get_days_of_week()

    def gpt_parse_office_hours(self):
        # pre-processing
        self.preprocess()
        chunks = self.text_to_chunks(prompt_file=self.OH_prompt)

        openai.api_key = self.openai_key

        with open(self.OH_prompt, 'r') as file:
            prompt_text = file.read().replace('\n', '')

        for pdf_text in chunks:
            # loop api calls so we go through all characters in self.pdf_text
            gpt_prompt = pdf_text + prompt_text
            response = openai.Completion.create(
                    model=self.gpt_model,
                    prompt=f'{gpt_prompt}', 
                    max_tokens=self.max_tokens_completion,
                    temperature=self.temperature,
                    # stream=True
                )
            response = (response.choices[0].text.replace("-",",")).split(",")
            if not self.response.get('office_hours', 0):
                self.response['office_hours'] = []

            self.response['office_hours'].extend(response)
        
        print(self.response)
        
        # TODO: need to do postprocessing for days of the week and office hours list
        

    def gpt_parse_class_timings(self):
        # pre-processing
        self.preprocess()

        openai.api_key = self.openai_key

        with open(self.prompt_file, 'r') as file:
            prompt_text = file.read().replace('\n', '')


        # TODO: fix to make it like gpt_OH (look at only first page chunk though,
        # if through testing you find this is not enough then look through all the 
        # chunks)
        # ensure text to parsed does not exceed model's maximum 
        # content length (1 token is abour 4 chars)
        if self.pdf_text:
            pdf_text = self.pdf_text[0:min(len(self.pdf_text), 8000)]

        gpt_prompt = pdf_text + prompt_text
        response = openai.Completion.create(
                model=self.gpt_model,
                prompt=f'{gpt_prompt}', 
                max_tokens=self.max_tokens_completion,
                temperature=self.temperature,
                # stream=True
            )
  
        response = (response.choices[0].text).split(";")
        print(response)

        # start_time = RegexHelper().format_time(response[1])
        # end_time = RegexHelper().format_time(response[2])

        # if start_time and end_time:
        #     print(start_time.group(), end_time.group())
        # else:
        #     print(start_time, end_time)

        # self.response['course'] = response[0]
        # self.response['class_start_time'] = "" if not start_time else start_time.group()
        # self.response['class_end_time'] = "" if not end_time else end_time.group()
        # self.response['days_of_week'] = response[3]
        # self.response['class_location'] = response[4]
        self.response['prof_names'] = response[5].split(',')

        self.course.name = response[0]

        self.response['days_of_week'] = response[3].split(',')
        self.response['days_of_week'] = process_days(self.response['days_of_week'])

        self.course.class_times = [Timing(location=response[4], start=response[1], 
                                            end=response[2], days_of_week=day, 
                                            attribute='lec') for day in 
                                            self.response['days_of_week']]

        print(self.course)
        # self.postprocess()

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
