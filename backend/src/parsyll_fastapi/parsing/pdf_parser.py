import PyPDF2
import openai
import os
import wandb

# from dotenv import load_dotenv

# load_dotenv()

# Information needed:
# {
#     course_num: IE314,
#     class_timings: [Tuesday, 3:30pm, 60minutes], [Thursday, 6:00pm, 60minutes],
#     location: EE129,
#     instructors:
#     {
#         {
#             name : Prof Davis,
#             office_hours : [Tuesday, 4:30-5:30pm], [Thursday, 5:30-6:30pm],
#             office_location: EE 214
#         }
#     },
#     teaching_assistants:
#     {
#         {
#             name: Ibrahim,
#             office_hours: [Tuesday, 4:30-5:30pm], [Thursday, 5:30-6:30pm],
#             office_location: ARMS 1098
#         },
#         {
#             name: Seungkeun,
#             office_hours: [Tuesday, 4:30-5:30pm],
#             office_location: ARMS 2134
#         }

#     },
#     textbook: "Introduction to Real Analysis 4th Edition",
# }


def parse_gpt(pdfFile, promptFile):
    # run = wandb.init(project='Parsyll GPT Parsing')
    # prediction_table = wandb.Table(columns=["prompt", "completion"])

    pdf_file = open(pdfFile, "rb")

    reader = PyPDF2.PdfReader(pdf_file)

    for i in range(len(reader.pages)):
        page = reader.pages[i]
        page_text = page.extract_text()
        # print(page_text)

        openai.api_key = os.getenv("OPENAI_API_KEY")

        with open(promptFile, "r") as file:
            prompt_text = file.read().replace("\n", "")

        gpt_prompt = page_text + prompt_text
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=f"{gpt_prompt}",
            max_tokens=1250,
            temperature=0.3,
            # stream=True
        )
        # prediction_table.add_data(gpt_prompt, response['choices'][0]['text'])
        # parse next page only if not found on this page (class timings)
        if response != "0":
            break

    # wandb.log({'predictions': prediction_table})
    # wandb.finish()

    print(response.choices[0].text)
    pdf_file.close()
    return response.choices[0].text.split(",")


# parse_gpt('./etc/ie335_syllabus.pdf', 'prompts/class_timings2.txt')
