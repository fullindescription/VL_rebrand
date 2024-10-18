FROM python:3.10-slim-bullseye

COPY ./VL_rebrand ./app

RUN python3 -m pip install -r /app/requirements.txt

ENTRYPOINT [ "python3", "/app/manage.py", "runserver", "0.0.0.0:8000", "--noreload" ]

EXPOSE 8000