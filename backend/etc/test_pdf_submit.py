import httpx
# Create a dict with a key that has the same name as your file parameter and the file in binary form (the "b" in "rb")
f = {'file': open('proposal.pdf', 'rb')}
r = httpx.post("http://127.0.0.1:8000/pdfsubmit", files=f)
print(r)