FROM golang:latest
WORKDIR /src
COPY go.* ./ 
RUN go mod download 
COPY . /src
RUN go build -o /main
ENTRYPOINT ["/main"]