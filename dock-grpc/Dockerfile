FROM python:3.8

WORKDIR /app

COPY . /app

RUN pip install --no-cache-dir -r requirements.txt

CMD ["sh", "-c", "python3 -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. dock.proto && python3 manage.py"]