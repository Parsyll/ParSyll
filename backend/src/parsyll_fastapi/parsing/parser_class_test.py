import os
from parser_class import Parser
from dotenv import load_dotenv
import platform
import os
import openai
import tiktoken

load_dotenv()




parser = Parser(openai_key=os.getenv("OPENAI_API_KEY"),
    pdf_file = 'backend/src/parsyll_fastapi/parsing/etc/s2.pdf', 
    class_timings_prompt = 'backend/src/parsyll_fastapi/parsing/prompts/class_timings3.txt', 
    temperature = 0.1, 
    max_tokens_completion =  1250,
    max_tokens_context = 4000,
    gpt_model = "text-davinci-003",
    OH_prompt='backend/src/parsyll_fastapi/parsing/prompts/office_hours.txt')


parser.gpt_parse()
# parser.write_ics()



