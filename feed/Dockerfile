FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5004

ENV PORT 5004

CMD ["sh", "-c", "sleep 120 && python manage.py sync_cassandra && python manage.py runserver 0.0.0.0:5004"]
