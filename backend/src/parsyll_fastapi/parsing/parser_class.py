import PyPDF2
import openai
import os
import wandb
import nltk
import ssl
from nltk.corpus import stopwords

# try:
#     _create_unverified_https_context = ssl._create_unverified_context
# except AttributeError:
#     pass
# else:
#     ssl._create_default_https_context = _create_unverified_https_context
# nltk.download('punkt')
# nltk.download('stopwords')
from nltk.tokenize import word_tokenize

class Parser():
    def __init__(self, openai_key, pdf_file, prompt_file, 
                 temperature, max_tokens, gpt_model):
        self.openai_key = openai_key
        self.pdf_file = pdf_file
        self.prompt_file = prompt_file
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.gpt_model = gpt_model

        self.pdf_text = ''
        self.stopwords = set(stopwords.words())


    def extract_text(self):
        pdf_file = open(self.pdf_file, 'rb')
        reader = PyPDF2.PdfReader(pdf_file)

        for i in range(len(reader.pages)):
            page = reader.pages[i]
            page_text = page.extract_text()
            self.pdf_text += page_text
        
        pdf_file.close()

    def remove_stopwords(self):
        self.extract_text()
        text_tokens = word_tokenize(self.pdf_text)
        tokens_without_sw = [word for word in text_tokens if not word in self.stopwords]
        self.pdf_text = " ".join(tokens_without_sw)

    def gpt_parse(self):
        openai.api_key = self.openai_key

        with open(self.prompt_file, 'r') as file:
            prompt_text = file.read().replace('\n', '')

        # ensure text to parsed does not exceed model's maximum 
        # content length (1 token is abour 4 chars)

        pdf_text = self.pdf_text[0:8000]

        gpt_prompt = pdf_text + prompt_text
        response = openai.Completion.create(
                model=self.gpt_model,
                prompt=f'{gpt_prompt}', 
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                # stream=True
            )
        
        print(response.choices[0].text)


parser = Parser(openai_key=os.getenv("OPENAI_API_KEY"),
      pdf_file = './etc/s1.pdf', 
      prompt_file = 'prompts/class_timings2.txt', 
      temperature = 0.3, 
      max_tokens =  1250,
      gpt_model = "text-davinci-003")


parser.extract_text()
print(len(parser.pdf_text))

parser.remove_stopwords()
print(len(parser.pdf_text))

parser.gpt_parse()