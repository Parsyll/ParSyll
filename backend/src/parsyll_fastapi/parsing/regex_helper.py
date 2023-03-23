import re


class RegexHelper:
    def format_time(self, time):
        start_time = re.search(r"([0-9]{,2}\s*:\s*[0-9]{,2})\s*(pm|am)", time)

        return start_time
