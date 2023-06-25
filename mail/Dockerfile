FROM golang:latest

WORKDIR /project/go-docker/

COPY go.* ./
RUN go mod download

COPY . .
RUN go build -o /project/go-docker/build/myapp .

EXPOSE 8080
ENTRYPOINT [ "/project/go-docker/build/myapp" ]