FROM python:3.10-slim-bullseye

COPY VL_rebrand /home

RUN "python3 -m pip install -r requirements.txt"

ENTRYPOINT [ "python3", "manage.py", "runserver" ]