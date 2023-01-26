import PyPDF2
import openai
import os


def parse_gpt(pdfFile, promptFile):
    pdf_file = open(pdfFile, 'rb')

    reader = PyPDF2.PdfReader(pdf_file)

    for i in range(len(reader.pages)):
        page = reader.pages[i]
        page_text = page.extract_text()
        # print(page_text)
    
        openai.api_key = os.getenv("OPENAI_API_KEY")

        with open(promptFile, 'r') as file:
            prompt_text = file.read().replace('\n', '')

        response = openai.Completion.create(
                model="text-davinci-003",
                prompt=f'{page_text} {prompt_text}', 
                max_tokens=1250,
                temperature=0.7,
                # stream=True
            )
        # parse next page only if not found on this page (class timings)
        if response != "0":
            break

    print(response.choices[0].text)
    pdf_file.close()




# parse_gpt('./etc/ie335_syllabus.pdf', 'prompts/class_timings2.txt')
# parse_gpt('./etc/proposal.pdf')