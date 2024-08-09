/**
 * WEBSOCKET CENTRAL SERVER
 */
import { WebSocketServer } from "ws";

const serverPorts = [8080, 8081, 8082];
var sPort = 0;

var wss; 

//List of other WS connected 
var fleet = [];

newConnection(sPort);



/* ********** SERVER **********  */

function newConnection(sPort){
    console.log("GRAN-CENTRAL WS IS UP at: " + serverPorts[sPort]);
    
    wss = new WebSocketServer({ port: serverPorts[sPort] });
    
    wss.on('error', function(){
        console.log('Port already in use');
        sPort++;
        if(sPort < serverPorts.length){
            newConnection(sPort);
        }
    })


    wss.on("connection", function connection(ws, req) {
        
        const response = {
            id: serverPorts[sPort],
            message : "Welcome to the GranCentral Dispatch"
        }

        //get info from connection
        const newUrl = new URL('https://localhost'+req.url);
        const cid = newUrl.searchParams.get('cid')

        console.log('New client Connection id ' + cid);
        
        //Send the central socket info to the new stablished connection. 
        ws.send(JSON.stringify(response));


        //Messages from ws clients
        ws.on('message', function message(data) {
            const info = JSON.parse(data)
            console.log("Message from %s: %s", info.client_id, info.message);

            //when the message contain and wclient and webid, save this connection on the FLEET array
            if(info.type == 'new' && info.client_id && info.web_id){
                fleet.push({client: info.client_id, web: info.web_id, name:info.webname, ws: ws})

                const sendData = {
                    data: fleet,
                    count: fleet.length,
                    message: 'Connected Web CLientes',
                    type: 'all'
                }
                
                fleet.forEach(item => {
                    sendData.to = item.web;
                    item.ws.send(JSON.stringify(sendData))
                })
            }

            //when reconect from another server, update their web clients 
            if(info.type == 'update' && info.client_id && info.count > 0){
                info.web_clients.forEach(w_client => {
                    fleet.push({client: info.client_id, web: w_client.id, name:w_client.name, ws: ws})
                })
                console.log('Updated fleet, %s new web clients', info.count);
            }

            //When the messages contains a TO option, despatch the data to that ws. 
            if(info.to){
                console.log("Sending data to: " + info.to);

                const destination = fleet.filter(s => s.web == info.to);
                if(destination){
                    destination.forEach(item => {
                        item.ws.send(data);
                    });
                }

                
                
            }
        });

        ws.on('close', function(){
            console.log('Clossing client');
            fleet = fleet.filter(s => (JSON.stringify(s.ws) != JSON.stringify(ws) ) )
        })
        
        
    });

}







