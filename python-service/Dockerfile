FROM python:3.9-alpine

RUN apk add build-base

COPY . /opt/app
WORKDIR /opt/app

EXPOSE 7104

RUN pip install -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7104", "--workers", "4"]