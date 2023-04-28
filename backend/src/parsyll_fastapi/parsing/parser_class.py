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

from .parser_regex import Regex

from parsyll_fastapi.parsing.utility import add_ics_event, create_ics_event, add_time_to_date, process_days, process_office_hours, process_time, get_start_date
from parsyll_fastapi.models.model import Course, Timing, CourseBase, Person 
from parsyll_fastapi.parsing.prompts.course_dynamic import prompt_text, course_example


load_dotenv()  # take environment variables from .env.

# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_deCMDfault_https_context = _create_unverified_https_context
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/stopwords')
except LookupError:
    nltk.download('stopwords')
# nltk.download('punkt')
# nltk.download('stopwords')

from nltk.tokenize import word_tokenize


class Parser():
    def __init__(self, openai_key=None, pdf_file=None, class_timings_prompt=None, 
                 temperature=None, max_tokens_completion=None, max_tokens_context = None, 
                 gpt_model=None, OH_prompt=None):
        '''
        Inputs:
        1. openai_key: The open ai key used for the GPT api calls
        2. pdf_file: the file path for the pdf file to be parsed
        3. class_timings_prompt = file path for prompt to parse class timings
        4. OH_prompt = file path for prompt to get office hours 
        5. temperature = temperature parameter in GPT api calls that determines how
                         much "risk" the model should take
        6. max_tokens_completion = the max number of tokens for the response from GPT
                                   (1 token is roughly 4 characters)
        7. max_tokens_context = max number of tokens for the model used which includes the tokens
                                for the prompt and response together
        8. gpt_model = which gpt3 model should be used
        '''
        self.openai_key = openai_key
        self.pdf_file = pdf_file
        self.class_timings_prompt = class_timings_prompt
        self.OH_prompt = OH_prompt
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
        
        # self.regex_parse(self.pdf_text)
        # self.regex_parse(self.pdf_text)
        
        pdf_file.close()
    
    def regex_parse(self, text):
        regex = Regex()
        course_name = regex.get_course_name(text)
        print(regex.fix_course_names(course_name))
        print(regex.get_emails(text))
        print(regex.get_grades(text))
        print(regex.get_credit_hours(text))
        print(regex.get_urls(text))
        print(regex.get_instructor(text))
        

    def remove_stopwords(self):
        if self.pdf_text:
            text_tokens = word_tokenize(self.pdf_text)
            tokens_without_sw = [word for word in text_tokens if not word in self.stopwords]
            self.pdf_text = " ".join(tokens_without_sw)
        
    def get_num_tokens(self, text=None, file=None):
        '''
        Calculates the number of tokens in either a file or a piece of text
        '''
        if file:
            with open(file, 'r') as file1:
                text = file1.read()
        
        encoding = tiktoken.get_encoding("gpt2")
        tokens = encoding.encode(text)
        return len(tokens), tokens, encoding

    def text_to_chunks(self, prompt_file=None, prompt_text=None, chunk_size=2000, overlap=100):
        
        '''
        Coverts the PDF text to chunks where chunks are the max possible subdivisions of the 
        pdf text such that the max tokens limit is not exceeded for the model
        '''
        if prompt_file:
            # max tokens context >= prompt tokens + chunk tokens + completion tokens
            chunk_size = self.max_tokens_context - self.max_tokens_completion - (self.get_num_tokens(file=prompt_file))[0]

        elif prompt_text:
            chunk_size = self.max_tokens_context - self.max_tokens_completion - (self.get_num_tokens(text=prompt_text))[0]

        # print(chunk_size)
        num_pdf_tokens, tokens, encoding = self.get_num_tokens(text=self.pdf_text)

        chunks = []
        for i in range(0, num_pdf_tokens, chunk_size - overlap):
            chunk = tokens[i:i + chunk_size]
            chunks.append(chunk)
        
        # print(len(chunks))
        chunks = [encoding.decode(chunk) for chunk in chunks]
        return chunks

    def preprocess(self):
        self.extract_text()
        self.remove_stopwords()

    # def gpt_parse_office_hours(self):
    #     chunks = self.text_to_chunks(prompt_file=self.OH_prompt)

    #     openai.api_key = self.openai_key

    #     with open(self.OH_prompt, 'r') as file:
    #         prompt_text = file.read().replace('\n', '')
        
    #     self.response['office_hours'] = []{'name': 'ECE 469', 'instructors': [{'name': 'Santiago', 'email': 'santiago@purdue.edu', 'isProf': True}], 'syllabus': 'fd9fc608-d903-45c9-9b71-0d8bd57fe9f5', 'ics_file': [], 'class_times': [{'location': 'EE 117', 'start': '4:30 PM', 'end': '5:20 PM', 'day_of_week': 'Monday', 'attribute': 'lec'}, {'location': 'EE 206', 'start': '9:30 AM', 'end': '11:20 AM', 'day_of_week': 'Thursday', 'attribute': 'lec'}], 'school': 'Purdue University', 'credit_hrs': 4, 'grading_scheme': None, 'miscs': [{'value': 'how to code 101', 'tag': 'textbook'}]} 

    #     for pdf_text in chunks:
    #         # loop api calls so we go through all characters in self.pdf_text
    #         gpt_prompt = pdf_text + prompt_text
    #         response = openai.Completion.create(
    #                 model=self.gpt_model,
    #                 prompt=f'{gpt_prompt}', 
    #                 max_tokens=self.max_tokens_completion,
    #                 temperature=self.temperature,
    #                 # stream=True
    #             )
    #         response = (response.choices[0].text.split(";"))
    #         # print(response)
    #         # print()
    #         for office_hour in response:
    #             self.response['office_hours'].extend(process_office_hours(office_hour))

    #     self.course.office_hrs = []

    #     # office_hour format: Instructor Name, Start Time, End Time, Day, Location
    #     # print(self.response)
    #     for office_hour in self.response['office_hours']:
    #         person = Person(name=office_hour[0], isProf=office_hour[0] in self.response['prof_names'])
    #         office_hour_timing = OfficeHourTiming(location=office_hour[4], start=office_hour[1], 
    #                                               end=office_hour[2], day_of_week=office_hour[3], 
    #                                               attribute='office hours', instructor=person)
    #         self.course.office_hrs.append(office_hour_timing)

    #     print(self.course)


    def gpt_parse_course(self):
        print(prompt_text)
        chunks = self.text_to_chunks(prompt_text=prompt_text)
        openai.api_key = self.openai_key

        # optimization: parsing class timings only from the first chunk 
        # hence the break statement is present
        for pdf_text in chunks:

            gpt_prompt = pdf_text + prompt_text
            response = openai.Completion.create(
                    model=self.gpt_model,
                    prompt=f'{gpt_prompt}', 
                    max_tokens=self.max_tokens_completion,
                    temperature=self.temperature,
                    # stream=True
                )
            break

        try:
            print("GPT response")
            response = (eval(response.choices[0].text))
        except:
            print("GPT response failed, using default course example")
            response = course_example.dict()

        print(response)

        try:
            self.course = CourseBase(**response)
            print(self.course.class_times)
        except:
            print("There was an error trying to unpack response course dictionary")
            self.course = course_example
    

    def write_ics(self):
        '''
        Writes the ics file for class timings and office hours
        '''
        if self.course:

            c = Calendar() # Calendar object

            # get current datetime
            dt = datetime.today()

            # get day of week as an integer
            today_day = datetime.now().weekday()

            # add events for class lectures
            for timing in self.course.class_times:
                c = add_ics_event(c=c, today_day=today_day, dt=dt, timing=timing, 
                                  course_name=self.course.name)

            # add events for office hours
            # for timing in self.course.office_hrs:
            #     c = add_ics_event(c=c, today_day=today_day, dt=dt, timing=timing, 
            #                       course_name=self.course.name)
            

            with open('my.ics', 'w') as my_file:
                my_file.writelines(c.serialize_iter())
                self.course.ics_file = c.serialize_iter()

            current_month = (datetime.today() + timedelta(weeks=16)).strftime('%Y%m%d')
            repeat_weekly = f"RRULE:FREQ=WEEKLY;UNTIL={current_month}T000000Z\r\n"

            ics_with_repeat = []
            for i, s in enumerate(self.course.ics_file):
                ics_with_repeat.append(s)
                if "DTSTART" in s:
                    ics_with_repeat.append(repeat_weekly)
            
            self.course.ics_file = ics_with_repeat

            
        else:
            self.course.ics_file = []
            return

    def gpt_parse(self):
        self.preprocess()
        self.gpt_parse_course()
        # self.gpt_parse_office_hours()
