# ParSyll

ParSyll is a dashboard that has 2 main goals:
1. Allow students to upload their syllabus and generate a downloadable calendar.
2. Display important information about instructor and course.
# Parsyll
We aim to automate your early semester syllabus reading through an easy-to-access dashboard. ParSyll parses key information from your syllabus such as class times, instructor information, locations and more!

Our main functionalities:
- Drop pdf for parsing
- Download pdf after parsing
- Add/Edit fields to keep consistent with course
- Easy access to all courses of the syllabus you have parsed

## Run Locally
**NOTICE: YOU MUST HAVE YOUR OWN ENV FILE TO RUN THE PROJECT**
### Two ways of running parsyll locally:
* (**Docker**) Run `docker-compose up && docker-compose rm -fsv` where the docker-compose file is located in the main directory.
* (**Locally**) 
    *  **Frontend**: `cd` into */react-frontend*, run `npm install` and then `npm start`.
    *  **Backend**: `cd` into *backend/src/parsyll_fastapi/*, run `pip install -r requirements.txt` and then `python3 main.py`.

