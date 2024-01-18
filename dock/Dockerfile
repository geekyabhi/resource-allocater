FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5005

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:5005"]