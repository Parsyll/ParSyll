import os
from parser_class import Parser
from dotenv import load_dotenv

load_dotenv()

parser = Parser(openai_key=os.getenv("OPENAI_API_KEY"),
    pdf_file = 'backend/src/parsyll_fastapi/parsing/etc/s2.pdf', 
    prompt_file = 'backend/src/parsyll_fastapi/parsing/prompts/office_hours.txt', 
    temperature = 0.1, 
    max_tokens =  1250,
    gpt_model = "text-davinci-003",
    DOW_promptfile= 'backend/src/parsyll_fastapi/parsing/prompts/DOW_prompt.txt')

parser.preprocess()
# print(parser.pdf_text)
parser.gpt_parse_office_hours()

# parser.write_ics()

