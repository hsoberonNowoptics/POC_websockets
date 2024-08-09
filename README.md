# POC_websockets
Probe of concept for different websockets clients, communicating using a central dispatch websocket server.

### WEBSOCKET CENTRAL
Called gran-central,
is use as dispatch messaging and connection hub of the clients. 
_can be run up to 3 times to have 3 clients PORTS 8080, 8081, 8082_ 


### CLIENT HIBRID Client-Server
called Line, 
Connects to GranCentral and send its own data. 
Receives connections from WEB clients and redirects messages to CENTRAL


### Web Pages
Can be load many times at once 
Connect display 3 lines to manualy connect to.
Receives other Web Clients 
Send messages to selected web 



# To TEST

- Clone the project
- verify is running NODE >= V22
- Run the _socketCentral_ project with `node index.js`
- Run other _socketCentral_ to be the redundant central server
- Then Start the _clientSocket_ multiple times with `node index.js`
- Open _www/index.html_ the webpage on two different windows

````
Line 1 WS IS UP
Welcome to the GranCentral Dispatch
````

```
GRAN-CENTRAL WS IS UP at: 8080
```

```
Client ID: 0a52d9d8
Starting on port: 8091
Connected to Grand Central at port 8080
Welcome to the GranCentral Dispatch
```

``` 
Client ID: 0f25e05f
Starting on port: 8091
Port already in use
Starting on port: 8092
Connected to Grand Central at port 8080
Welcome to the GranCentral Dispatch
New Connection from : Nore (b717e41c)
Connected Web CLientes
Message from b717e41c to CENTRAL
Message from b717e41c to CENTRAL
Message from b717e41c to CENTRAL
Message from b717e41c to CENTRAL
Message from b717e41c to CENTRAL
```

