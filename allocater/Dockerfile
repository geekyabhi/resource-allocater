FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5003

ENV PORT 5003

RUN apt-get update && apt-get install -y docker.io

CMD ["sh", "-c", "sleep 5 && python manage.py runserver 5003"]

