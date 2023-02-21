import PyPDF2

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


def remove_stopwords(pdf_file):
    pdf_file = open(pdf_file, 'rb')

    reader = PyPDF2.PdfReader(pdf_file)
    full_text = ''
    for i in range(len(reader.pages)):
        page = reader.pages[i]
        page_text = page.extract_text()
        full_text += page_text

    print(len(full_text))
    text_tokens = word_tokenize(full_text)
    print(len(text_tokens))

    # to reduce look up time to O(1)
    stopwords_set = set(stopwords.words())
    
    tokens_without_sw = [word for word in text_tokens if not word in stopwords_set]
    print(len(tokens_without_sw))
    print(" ".join(tokens_without_sw))


remove_stopwords('./etc/s1.pdf')
