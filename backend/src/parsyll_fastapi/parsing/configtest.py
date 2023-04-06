import os

from configparser import ConfigParser

filename = "backend/src/parsyll_fastapi/parsing/config.ini"
if os.path.isfile(filename):
    # parser = ConfigParser.SafeConfigParser()
    parser = ConfigParser()
    parser.read(filename)

    # print(parser.sections())
    # print(type((parser["parsing"]["PROMPT_FILE"])))
else:
    print("Config file not found")

print(parser.sections())