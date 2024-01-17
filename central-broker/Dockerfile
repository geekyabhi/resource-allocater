# Use an official Go runtime as a parent image
FROM golang:latest as builder

# Set the working directory inside the container
WORKDIR /go/src/app

# Copy the go.mod and go.sum files to the working directory
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed.
RUN go mod download

# Copy the current directory contents into the container at /go/src/app
COPY . .

# Use buildx-specific ARG and target platform
ARG TARGETPLATFORM
ARG BUILDPLATFORM

# Build the Go app for the specified target platform
RUN GOARCH=${TARGETPLATFORM##*/} go build -o main .

# Final lightweight image
FROM scratch

# Copy the binary from the builder stage
COPY --from=builder /go/src/app/main /main

# Expose port 8080 to the outside world
EXPOSE 8080

# Command to run the executable
CMD ["/main"]
