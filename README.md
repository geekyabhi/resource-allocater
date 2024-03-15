# Project overview -

-   Use case of project is to provide resource of different services to the user in form of instances by proving them host and port to run and attach the service . It also maintains the downtime and volumes of the services .
- It provides facilities like fetching instances details , create instance , stop instance , restart instance , remove instance , fetching realtime streaming logs.
- This all happens on the user level only and services are highly decoupled for the other users.

----------------

# Architecture overview -
- This is the backend sever providing the set of apis for all the usecases from creating user , instances to real time streaming logs. 
-  This project follows the microservices event driven architecture , which makes all the services decoupled from each other which leads to robustness , scalable and a secure application .

----
## High Level Design
![image](https://github.com/geekyabhi/resource-allocater/assets/55759980/aa67fd24-fc03-4dcd-9e2c-64855fd0bbb2)
https://whimsical.com/resource-allocater-hld-AuA69B8x4jGpYofUNxtzPA

<!-- <iframe style="border:none" width="800" height="450" src="https://whimsical.com/embed/AuA69B8x4jGpYofUNxtzPA"></iframe> -->


## Service Details

### User Service:

- Manages user-related operations, including signup, login, fetching user profiles, sending OTPs, and verifying OTPs.
- Implemented in Node.js.
- Uses MySQL for permanent storage and Redis for caching.

### Machines Service:

- Responsible for creating services that can be provided to users on demand.
- Implemented in Node.js.
- Uses MongoDB for saving rules and other meta-details about the machine and Redis for caching.

### Allocation Service:

- Responsible for allocating instances to users based on the rules of the given machine ID.
- Implemented in Python.
- Utilizes MySQL for permanent storage and Redis for caching.

### Feed Service:

- Handles comments, feedback, and likes given by users to the machine or service.
- Implemented in Python.
- Utilizes Cassandra for permanent storage and Redis for caching.

### Central Broker:

- Manages all events, such as making replicas of data for different services and asynchronous processing.
- Implemented in Golang.
- Interacts with databases of other services and dumps necessary data into them.

### Verifire Service:

- Verifies requests coming from users, performing necessary validations and providing required data.
- Implemented in Golang.
- Uses MongoDB for permanent storage and Redis for caching.

### Docker Service:

- Responsible for interaction with the Docker daemon of the host system, managing instance creation, start/restart, and stop processes.
- Implemented in Python.

### Notification Service:

- Sends notifications via phone number or email triggered by other services.
- Implemented in Golang.

### Interact Service:

- Responsible for retrieving real-time streaming logs from any instance or service running on the Docker engine.
- Implemented in Node.js.

## Additional Details

In the microservices architecture, several key components contribute to the system's functionality:

### NGINX as a Reverse Proxy

- **NGINX:** Efficiently directs incoming requests to microservices, optimizing performance and bolstering security.

### Docker for Service Hosting

- **Docker:** Encapsulates microservices in a standardized and lightweight environment, ensuring consistency across diverse environments and simplifying deployment and scaling.

### Kafka for Asynchronous Communication

- **Kafka:** Facilitates seamless asynchronous communication between microservices, enabling the decoupling of services, resilience, and efficient handling of high data volumes.

### gRPC for Synchronous Intercommunication

- **gRPC:** Employs a high-performance framework for synchronous intercommunication between services, enhancing the efficiency of service-to-service communication.

### WebSocket for Real-Time Logs

- **WebSocket:** Provides a bidirectional communication channel for real-time streaming logs, ensuring users receive timely updates.

### REST APIs for Frontend Interaction

- Certain services expose **REST APIs,** serving as a standardized interface for frontend interactions, offering simplicity and consistency.

### Languages Used

The project leverages a diverse set of programming languages tailored to specific tasks:

- **Python:** Allocation, Feed, Docker services.
- **Golang:** Central Broker, Notification services , Verifire services.
<!-- - **Rust:** Verifire, Limitify services. -->
- **Node.js:** Interact, User, Machines services.
- **NGINX:** Acts as a reverse proxy.

### Databases Used

The project utilizes various databases tailored to specific service needs:

- **MySQL:** Employed by the User Service and Allocation Service for permanent storage of user-related and allocation data, respectively.

- **Cassandra:** Utilized by the Feed Service for permanent storage of comments, feedback, and likes data.

- **MongoDB:** Chosen by the Verifire and Machines Services for saving rules, meta-details, and verification-related data.

- **Redis:** Acts as a caching mechanism for several services, including Allocation, Feed, User, and Machines Services, optimizing performance.

These components, languages, and databases collectively form a highly decoupled , event driven robust foundation, ensuring efficiency, scalability, and real-time capabilities in the microservices ecosystem .

---

## API Collection

[<img src="https://run.pstmn.io/button.svg" alt="Run In Postman" style="width: 128px; height: 32px;">](https://app.getpostman.com/run-collection/15798447-d6444277-f3d4-4bb4-ae8a-4d7b3743a742?action=collection%2Ffork&source=rip_markdown&collection-url=entityId%3D15798447-d6444277-f3d4-4bb4-ae8a-4d7b3743a742%26entityType%3Dcollection%26workspaceId%3D12545b3e-4229-4668-9e8e-d1dfcc5bb067#?env%5BResource%20Allocater%20NGINX%5D=W3sia2V5IjoiQkFTRV9VUkwiLCJ2YWx1ZSI6ImxvY2FsaG9zdDo1MDAwIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJsb2NhbGhvc3Q6NTAwMCIsInNlc3Npb25JbmRleCI6MH0seyJrZXkiOiJCQVNFX1VSTF9VIiwidmFsdWUiOiJsb2NhbGhvc3Q6NTAwMC91c2VyIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJsb2NhbGhvc3Q6NTAwMC91c2VyIiwic2Vzc2lvbkluZGV4IjoxfSx7ImtleSI6IkJBU0VfVVJMX00iLCJ2YWx1ZSI6ImxvY2FsaG9zdDo1MDAwL21hY2hpbmUiLCJlbmFibGVkIjp0cnVlLCJ0eXBlIjoiZGVmYXVsdCIsInNlc3Npb25WYWx1ZSI6ImxvY2FsaG9zdDo1MDAwL21hY2hpbmUiLCJzZXNzaW9uSW5kZXgiOjJ9LHsia2V5IjoiQkFTRV9VUkxfQSIsInZhbHVlIjoibG9jYWxob3N0OjUwMDAvYWxsb2NhdGlvbiIsImVuYWJsZWQiOnRydWUsInR5cGUiOiJkZWZhdWx0Iiwic2Vzc2lvblZhbHVlIjoibG9jYWxob3N0OjUwMDAvYWxsb2NhdGlvbiIsInNlc3Npb25JbmRleCI6M30seyJrZXkiOiJCQVNFX1VSTF9GIiwidmFsdWUiOiJsb2NhbGhvc3Q6NTAwMC9mZWVkIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJsb2NhbGhvc3Q6NTAwMC9mZWVkIiwic2Vzc2lvbkluZGV4Ijo0fSx7ImtleSI6IkJBU0VfVVJMX0QiLCJ2YWx1ZSI6ImxvY2FsaG9zdDo1MDA1IiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJsb2NhbGhvc3Q6NTAwNSIsInNlc3Npb25JbmRleCI6NX0seyJrZXkiOiJ0b2tlbiIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZSwidHlwZSI6ImRlZmF1bHQiLCJzZXNzaW9uVmFsdWUiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKbGJXRnBiQ0k2SW1GaWFHa3VZM0psWVhSbFFHOTFkR3h2YjJzdVkyOXRJaXdpYVdRaU9pSmlNMlUzTWpWaU1tSmtNMlEwT1dRMVlqSXlOelJoWmpFd1pEZzRPR1UzTWlJcy4uLiIsInNlc3Npb25JbmRleCI6Nn1d)


**Postman Collections:** [Click Here](https://elements.getpostman.com/redirect?entityId=15798447-d6444277-f3d4-4bb4-ae8a-4d7b3743a742&entityType=collection)

---

## Setup Instructions

-   S1 Clone the project.
-   S2 Make sure that docker is installed in the system.
-   S3 Open terminal in root folder of the project where docker-compose.yml file is present and run following commands.

```bash

# make sure that port mentioned in the docker-compose.yaml file are free
docker compose build --no-cache
docker compose up
# to close this 
docker compose down -v
```


