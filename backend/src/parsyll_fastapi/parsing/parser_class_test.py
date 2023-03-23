import os
from parser_class import Parser
from dotenv import load_dotenv

load_dotenv()

parser = Parser(
    openai_key=os.getenv("OPENAI_API_KEY"),
    pdf_file="./etc/s1.pdf",
    prompt_file="./prompts/class_timings2.txt",
    temperature=0.1,
    max_tokens=1250,
    gpt_model="text-davinci-003",
    DOW_promptfile="./prompts/DOW_prompt.txt",
)

parser.gpt_parse()
parser.write_ics()
