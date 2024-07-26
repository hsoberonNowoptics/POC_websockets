/**
 * WEBSOCKET CENTRAL SERVER
 */
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

console.log("GRAN-CENTRAL WS IS UP")

//List of other WS connected 
const fleet = [];

wss.on("connection", function connection(ws) {
    
    console.log('New Connection');

    
    const response = {
        id: 8080,
        title: "Grand Central",
        message : "Welcome to the GranCentral Dispatch"
    }
    
    //Send the central socket info to the new stablished connection. 
    ws.send(JSON.stringify(response));


    //Messages from ws clients
    ws.on('message', function message(data) {
        const info = JSON.parse(data)
        console.log("Message from: %s \n %s", info.title, info.description);

        //when the message contain and id, save this connection on the FLEET array
        if(info.id){
            fleet[info.id] = ws;
        }

        //When the messages contains a TO option, despatch the data to that ws. 
        if(info.to){
            console.log("Sending data to: " + info.to);

            fleet[info.to].send(JSON.stringify(info))
            
        }
      });
    
    
});