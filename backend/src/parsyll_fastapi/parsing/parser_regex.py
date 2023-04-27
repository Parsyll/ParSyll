import re

class Regex:
    def __init__(self):
        pass
    
    def fix_course_names(self, text):
        new_content = []
        i = 0
        while i < len(text):
            if i + 1 < len(text):
                if text[i][-1].isnumeric() and text[i + 1][0].isnumeric():
                    new_content.append(text[i] + text[i + 1])
                    i += 2
                    continue
                elif (
                    text[i][-1].isalpha()
                    and len(text[i + 1]) <= 2
                    and text[i + 1][0].isalpha()
                ):
                    new_content.append(text[i] + text[i + 1])
                    i += 2
                    continue
            new_content.append(text[i])
            i += 1

        return new_content

    def get_course_name(self, text):
        courseName = re.search(r"([A-Z]{2,4}\s?[0-9]{2,5})[:\-]?\s?(.{0,40})?\b", text)
        return None if not courseName else courseName.groups()


    def get_emails(self, text):
        print("Starting email parsing")

        regex_parse = r"(\s*\b[a-zA-Z]*\b\s*)*[\,\s\(]*([a-z0-9_\.-]+@[\da-z\.-]+\.[a-z\.]{2,6})[\s\)]*"
        regex_parse = r"[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
        emails = re.findall(
            regex_parse,
            text,
        )
        return emails


    def get_grades(self, text):
        grades = re.findall(
            r"([ABCD][+–-]?)[\s:]*\[?([0-9]{0,3})%?\s*[–,]\s*([0-9]{0,3})%?\]?", text
        )

        if grades:
            if any(["" in list(x) for x in grades]):
                return None
            grades.sort(key=lambda x: int(x[2]), reverse=True)
            return grades

        return None


    def get_credit_hours(self, text):
        credits = None
        credits = re.search(r"([0-9]+)\s*[cC]redit[s]?", text)
        if not credits:
            credits = re.search(r"[cC]redit[\s\w:]*([0-9]+)", text)

        return None if not credits else credits.groups()


    def get_urls(self, text):
        urls = re.findall(
            r"(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})",
            text,
        )
        return urls


    def get_instructor(self, text):
        instructor = None
        instructor = re.search(r"([iI]nstructor|[pP]rofessor)\s*[:-]\s*(.*)", text)
        return instructor
    