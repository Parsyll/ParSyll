# Parsyll
We aim to automate your early semester syllabus reading through an easy-to-access dashboard. ParSyll parses key information from your syllabus such as class times, instructor information, locations and more!

Goals:
- Allow students to upload their syllabus and generate a downloadable calendar.
- Display important information about instructor and course.

Our main functionalities:
- Drop pdf for parsing
- Download pdf after parsing
- Add/Edit fields to keep consistent with course
- Easy access to all courses of the syllabus you have parsed

## Run Locally
**NOTICE: YOU MUST HAVE YOUR OWN ENV FILE TO RUN THE PROJECT**
* Env in /react-frontend should include:
  * REACT_APP_PARSEAPP_URL (URL of backend)
* Env in /backend/src/parsyll_fastapi should include:
  * JWT_SECRET (Secret to sign JWT Tokens)
  * JWT_ALGORITHM (JWT signing algorithm)
  * FIREBASE_SERVICE_ACCOUNT (Firebase account to use firebase SDK)
  * FIREBASE_CONFIG (For Firebase SDK)
  * OPENAI_API_KEY (OpenAI key to use OpenAIs developer API)
 
### Two ways of running parsyll locally:
* (**Docker**) Run `docker-compose up && docker-compose rm -fsv` where the docker-compose file is located in the main directory.
* (**Locally**) 
    *  **Frontend**: `cd` into */react-frontend*, run `npm install` and then `npm start`.
    *  **Backend**: `cd` into *backend/src/parsyll_fastapi/*, run `pip install -r requirements.txt` and then `python3 main.py`.

## Homepage
This is where the user is greeted and prompted to login.
![alt text](misc/parsyll_homepage.png)

## Course Dashboard
This is a preview of the Dashboard that the user will have once they have populated the dashboard.
![alt text](misc/parsyll_dashboard.png)

## PDF drop zone
This is a preview of where the user can drop their pdf for parsing.
![alt text](misc/parsyll_parse_pdf.png)

## Licensing
We chose MIT license as our project is geared towards Purdue University. We would like our project to be open-sourced and widely adapted by other universities, hence we would want our project to be easily distributed to other students who would like to adpot this project to their university. MIT is a more permissive license while limiting the liability that we have, and since this was our senior design project, this is a hastily completed projects by undergraduate students, it is possible that this project consists of breaking-bugs or security issues that are overlooked.
