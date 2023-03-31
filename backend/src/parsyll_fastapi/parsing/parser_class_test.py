import os
from parser_class import Parser
from dotenv import load_dotenv
import platform
import os
import openai
import tiktoken

load_dotenv()

def text_to_chunks(text, chunk_size=2000, overlap=100):

    encoding = tiktoken.get_encoding("gpt2")

    tokens = encoding.encode(text)
    num_tokens = len(tokens)
    print("Number of tokens: ", num_tokens)

    chunks = []
    for i in range(0, num_tokens, chunk_size - overlap):
        chunk = tokens[i:i + chunk_size]
        chunks.append(chunk)
    
    print(len(chunks))
    # print(encoding.decode(chunks[0]))

    return chunks


parser = Parser(openai_key=os.getenv("OPENAI_API_KEY"),
    pdf_file = 'backend/src/parsyll_fastapi/parsing/etc/s2.pdf', 
    prompt_file = 'backend/src/parsyll_fastapi/parsing/prompts/class_timings3.txt', 
    temperature = 0.1, 
    max_tokens_completion =  1250,
    max_tokens_context = 4000,
    gpt_model = "text-davinci-003",
    DOW_promptfile= 'backend/src/parsyll_fastapi/parsing/prompts/DOW_prompt.txt',
    OH_prompt='backend/src/parsyll_fastapi/parsing/prompts/office_hours.txt')

parser.preprocess()
# print(parser.pdf_text)
# parser.gpt_parse_class_timings()
parser.gpt_parse_office_hours()

# parser.write_ics()

# chunks = text_to_chunks(parser.pdf_text, chunk_size=4000-1250)

