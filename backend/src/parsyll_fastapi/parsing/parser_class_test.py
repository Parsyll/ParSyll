import os
from parser_class import Parser
from dotenv import load_dotenv
import platform
import os
import openai
import tiktoken

load_dotenv()
from configparser import ConfigParser

# get configs
filename = os.getcwd() + "config.ini"



configs = ConfigParser()
configs.read(filename)



parser = Parser(openai_key=os.getenv("OPENAI_API_KEY"),
    pdf_file = os.getcwd() + "/" + configs["parsing"]["PDF_FILE"], 
    class_timings_prompt = os.getcwd() + "/parsing/prompts/" + configs["parsing"]["PROMPT_FILE"], 
    temperature = float(configs["parsing"]["TEMPERATURE"]), 
    max_tokens_completion =  int(configs["parsing"]["MAX_TOKENS_COMPLETION"]),
    max_tokens_context=int(configs["parsing"]["MAX_TOKENS_CONTEXT"]),
    gpt_model = configs["parsing"]["GPT_MODEL"],
    OH_prompt=os.getcwd() + "/parsing/prompts/" + configs["parsing"]["OH_PROMPT"])


parser.gpt_parse()
# parser.write_ics()



