import PyPDF2

pdf_file = open('./etc/ie335_syllabus.pdf', 'rb')

reader = PyPDF2.PdfReader(pdf_file)

# print(len(reader.pages))

# page = reader.pages[0]
# print(page.extract_text())

for i in range(len(reader.pages)):
    page = reader.pages[i]
    print(page.extract_text())


pdf_file.close()