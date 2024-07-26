# POC_websockets
Probe of concept for different websockets clients, communicating using a central dispatch websocket server.

### WEBSOCKET CENTRAL
Called gran-central,
is use as dispatch messaging and connection hub of the clients. 


### CLIENT 1 
called Line 1, 
Connects to GranCentral and send its own data. 

### CLIENT 2 
Called Line 2,  
Connects to GrandCentral, send its own data, but also sends a destination as Line 1

- Grand central receives the line 2 message, redirect to line 1
- Line 1 gets the Line 2 messages and response with destination line 2 
- Grand central receives the line 1 and redirect to line 2. 
- Line 2 gets Line 1 info. 


# To TEST

- Clone the project
- verify is running NODE V22
- Run the _socketCentral_ project with `node index.js`

Then Start the _clientSocket_lane_1_ project with `node index.js`
````
Line 1 WS IS UP
Welcome to the GranCentral Dispatch
````

Finaly Start the _clientSocket_lane_2_ with `node index.js` 
```
Hi from Line 2
Best line in town
Sending message to central, destination lane 8081...
Receiving from :8080
Welcome to the GranCentral Dispatch
Receiving from :8081
Hello from Line 1
The #1 line in the fleet.
```



