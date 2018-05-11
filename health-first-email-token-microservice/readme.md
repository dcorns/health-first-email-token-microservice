# health-first-email-token-microservice
A micro service for issuing and verifying Jason Web Tokens based on an email address
## Requirements
Docker Installation compatible with the following versions:
   API: 1.37
   Client/Server: 18.03.1-ce
Yarn compatible with version 1.3.2
Yarn is the package manager used in the Dockerfile. If you prefer to use npm, change 'yarn' to 'npm' in the Dockerfile before running docker build.
## Installation
1. git clone this repository
2. Navigate to the directory in which the repository was cloned
3. Execute the command ```docker build -t health-first-email-token-microservice .```
## Usage
### Running The Service
#### Default Settings
   Starting the service with ```docker run -p 80:8080 -d health-first-email-token-microservice``` will cause the service to run with these default settings:
   Service will listen on port 80
   Issue tokens with the following details:
      iss:healthfirst
      exp: 5 minutes
   Use 'the big secret!' as the secret for creating tokens
##### Changing the default settings
   With the exception of the port, default settings can be changed in the build by modifying the Dockerfile.
      ENV SECRET your secret
      ENV ISS your iss
      ENV EXP your expiration value in minutes
   For example to have a secret of 'better secret', an iss of 'my other site', and a token expiration of 10 minutes:
      ENV SECRET better secret
      ENV ISS my other site
      ENV EXP 10
   Note that in order for the new Dockerfile to make any changes to the service you must stop it, if it is running, and then build it again using ```docker build -t health-first-email-token-microservice .```
   Changing defaults in the run statement.
      You can change all the default settings when running the container.
      ```docker run -p listeningPortNumber:8080 -d -e SECRET="useThisSecret" -e ISS="useThisForISS" -e EXP=expValue health-first-email-token-microservice```
   For example to have a secret of 'better secret', an iss of 'my other site', a token expiration of 10 minutes and listen on port 3000:
   ```docker run -p 3000:8080 -d -e SECRET="better secret" -e ISS="my other site" -e EXP=10 health-first-email-token-microservice```

### Stopping The Service
To stop the service, you first need to get the container id of the service using ```docker ps```
   The command will output something simular to this.
```
CONTAINER ID        IMAGE                                   COMMAND             CREATED             STATUS              PORTS                  NAMES
72005d7209d2        health-first-email-token-microservice   "node service.js"   24 seconds ago      Up 22 seconds       0.0.0.0:80->8080/tcp   condescending_minsky
```
If you have more than one container running make sure to use the id assigned to health-first-email-token-microservice.
   If the container id is 72005d7209d2 the command would be ```docker stop 72005d7209d2``` If it is the only container running, you could use a shorter version of the command ```docker stop 720```
### Additional Information on Docker
The docker commands used here a basic commands for using the service. For alternative commands and more information on docker see the [docker documentation](https://docs.docker.com)

## Consuming The Service
The service provides a rest API for accessing its features. It returns a json object that will at a minimum have a status property. It is best to check the status property before proccessing the return data since a status of "failure" indicates that there was an error and no data was returned.
### Requesting a token
/token/emailaddress
   For example
   ```http://www.serviceisrunninghere.com/token/myemail@email.com```
   returns {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJoZWFsdGhmaXJzdCIsImV4cCI6MTUyNTk5ODk1ODcwOSwiaWF0IjoxNTI1OTgxMDA3ODU2LCJlbWFpbCI6Ii9teWVtYWlsQGVtYWlsLmNvbSJ9.qcY-2joE-fYAqPzEhoNQiYNhM21ev9eBgwzhu4sAxYf-V-S9js5MhTYKBSeoiz3yHdCn2V_5OP52R94oWrRM_w","status":"success"}
Email validation is expected to be performed by the consumer of the service. If the input to the service is not a valid email, it will simply return a token based on that input. If the input is so bad a token can not be created, it will return {"status":"failure"}
### Validate a token
/validate/token
   For example
   ```http://www.serviceisrunninghere.com/validate/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJoZWFsdGhmaXJzdCIsImV4cCI6MTUyNTk5ODk1ODcwOSwiaWF0IjoxNTI1OTgxMDA3ODU2LCJlbWFpbCI6Ii9teWVtYWlsQGVtYWlsLmNvbSJ9.qcY-2joE-fYAqPzEhoNQiYNhM21ev9eBgwzhu4sAxYf-V-S9js5MhTYKBSeoiz3yHdCn2V_5OP52R94oWrRM_w```
   returns token payload:
          {"iss":"healthfirst","exp":1526005915681,"iat":1525987944800,"email":"myemail@email.com","status":"success"}
   if the token is valid
   otherwise it returns {"status":"failure"}

## Testing
For tests to pass, they must be run with the defaults set in Dockerfile.
   1. ```yarn install``` or ```npm install```
   2. Start the service using ```docker run -p 80:8080 -d health-first-email-token-microservice```
   3. ```yarn test``` or ```npm test```