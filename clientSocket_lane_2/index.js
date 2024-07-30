/**
 * LINE 2 WS Client
 */
import { WebSocket } from "ws";

//info of the lane 2
const lineData = {
    id : 8092,
    title : 'Line 2',
    message : 'Hi from Line 2',
    description : 'Best line in town'
}

console.log(lineData.message + '\n' + lineData.description);

//List of other WS connected 

var ws = new WebSocket('ws://localhost:8080');

ws.on('open', function() {
    console.log('Sending message to central, destination lane 8081...');

    lineData.to = 8091, // message to Line 1
    ws.send(JSON.stringify(lineData));
});

ws.on("message", function message(data) {
    const info = JSON.parse(data)
    console.log('Receiving from :' + info.id + '\n' + info.message);
    if(info.description) {
        console.log(info.description);
    }
});


ws.on("close", function(event) {
    console.log(JSON.stringify(event));
    
    var ws2 = new WebSocket('ws://localhost:8081');

    console.log("Reconnect to backup server");

    ws2.on("open", function(){
        console.log("Reconnect to backup server");

        ws2.send(JSON.stringify(lineData));
    });

    ws2.on("message", function message(data) {
        const info = JSON.parse(data)
        console.log('Receiving from :' + info.id + '\n' + info.message);
        if(info.description) {
            console.log(info.description);
        }
    });
});