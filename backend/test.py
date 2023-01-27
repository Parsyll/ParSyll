import re
import PyPDF2
import os

print(os.getcwd())
pdf_file = open("./s1.pdf", 'rb')
times = []
reader = PyPDF2.PdfReader(pdf_file)

for i in range(len(reader.pages)):
    page = reader.pages[i]
    page_text = page.extract_text()
    # print(page_text)
    x = re.findall(r"(([0-1]?\d|2[0-3]):[0-5]\d\s?(am|pm)?)", page_text) # Parse time
    y = re.findall(r"((Mo(n(day)?)?|Tu(e(sday)?)?|We(d(nesday)?)?|Th(u(rsday)?)?|Fr(i(day)?)?|Sa(t(urday)?)?|Su(n(day)?)?))\b", page_text) # Parse time
    print([i[0] for i in x], [i[0] for i in y])


pdf_file.close()

# x = re.search(r"([01][0-9]|2[0-4]):[0-5][0-9](\s)?(pm|am)?", txt)