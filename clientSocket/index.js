/**
 * LANE AS WS CLIENT 
*/
import { WebSocketServer, WebSocket } from "ws";
import crypto from 'crypto'

    //Client ID
    const cid = crypto.randomUUID().split('-')[0];
    console.log('Client ID: ' + cid);   
    
    //line one info with any data. 
    const lineData = {
        cid : cid,
        message : 'Hello from Line',
        description : 'The #1 line in the fleet.'
    }


    const serverPorts = [8091, 8092, 8093];
    var sPort = 0;
    var wss; 

    let web_clients = [];

    newConnection(sPort);


    /* ********** CLIENT **********  */


    //Connnection to WEBSOCKET CENTRAL
    var ws = new WebSocket('ws://localhost:8080/?cid='+cid);

    ws.on('open', function() {
        //send the socket info
        // ws.send(JSON.stringify(lineData));
        console.log('Connected to Grand Central');
    });

    ws.on("message", function message(data) {
        
        //the message is on JSON format 
        const info = JSON.parse(data)
        console.log(info.message);

        //Validation of optional data
        if(info.description) {
            console.log(info.description);
        }

        if(info.to){
            const sendTo = web_clients.filter(s => s.id == info.to )
            
            if(sendTo.length > 0){
                sendTo[0].ws.send(JSON.stringify(info));
            }
        }
        
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



    /* ********** SERVER **********  */


    function newConnection(sPort){
        console.log("Starting on port: " + serverPorts[sPort]);
        wss = new WebSocketServer({ port: serverPorts[sPort] });
        
        wss.on('error', function(){
            console.log('Port already in use');
            sPort++;
            if(sPort < serverPorts.length){
                newConnection(sPort);
            }
        })

        wss.on("connection", function connection(wsweb, req) {
            //Send the new conenction socket the info of this client. 
            lineData.status = 1;
            lineData.id = serverPorts[sPort];
            lineData.message = 'Hello from Line ' + serverPorts[sPort],
            wsweb.send(JSON.stringify(lineData));

            //get info from connection
            const newUrl = new URL('https://localhost'+req.url);
            const web_id = newUrl.searchParams.get('id')
            const web_name = newUrl.searchParams.get('name')
            console.log('New Connection from : ' + web_name + ' (' + web_id + ')');

            //register the new connection
            const newConn = {
                id: web_id,
                name: web_name, 
                ws: wsweb
            }
            web_clients.push(newConn);

            //send the web client to central. 
            var info = {
                message: 'New Connection from web page ' + web_id,
                client_id: cid, 
                web_id: web_id,
                webname: web_name 
            }
            ws.send(JSON.stringify(info));
            
            //if client disconnect, delete from list. 
            wsweb.on('close', function() {
                console.log(web_name + ' Closed the connection ' + web_id);
                web_clients = web_clients.filter(s => s.ws !== wsweb);
            })

            wsweb.on('message', function(data) {
                let info = JSON.parse(data)
                console.log('Message from ' + web_id + ' to CENTRAL');
                
                ws.send(data)
            });
        });

        
    }




