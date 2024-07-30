/**
 * LANE 1 WS CLIENT 
*/
import { WebSocket } from "ws";

    //line one info with any data. 
    const lineData = {
        id : 8091,
        title : 'Line 1',
        message : 'Hello from Line 1',
        description : 'The #1 line in the fleet.'
    }


console.log("Line 1 WS IS UP")


//Connnection to WEBSOCKET CENTRAL
var ws = new WebSocket('ws://localhost:8080');

ws.on('open', function() {
    //send the socket info
    ws.send(JSON.stringify(lineData));
});

ws.on("message", function message(data) {
    
    //the message is on JSON format 
    const info = JSON.parse(data)
    console.log(info.message);

    //Validation of optional data
    if(info.description) {
        console.log(info.description);
    }

    // //when reciving from the second client, send a response. 
    // if(info.id == 8092){
    //     lineData.to = info.id;
    //     ws.send(JSON.stringify(lineData));
    // }
    
});


ws.on("close", function(event) {
    // console.log(JSON.stringify(event));
    
    var ws2 = new WebSocket('ws://localhost:8081');

    ws2.on("open", function(){
        console.log("Reconnect to backup server");
    
        // console.log("Sending a message to 8092");
        // lineData.to = 8092;

        // ws2.send(JSON.stringify(lineData));
    })
    
});



