FROM python:3.9-buster

#RUN apk add build-base

COPY . /opt/app
WORKDIR /opt/app

EXPOSE 7104

RUN pip install -r requirements.txt

CMD ["python", "app.py"]