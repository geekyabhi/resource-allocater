FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5003

ENV PORT 5003

CMD ["sh", "-c", "\
    sleep 20 && \
    python manage.py makemigrations users && \
    python manage.py makemigrations allocate_machine && \
    python manage.py migrate && \
    python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./proto/dock.proto && \
    python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./proto/user.proto &&\
    python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. ./proto/machine.proto &&\
    python manage.py runserver 0.0.0.0:5003 \
"]
