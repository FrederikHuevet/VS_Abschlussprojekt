
//################################################################################################
//#                                    JSON WEB TOKENS JWT                                       #
//################################################################################################
//region
const jwt = require('jsonwebtoken');
// TheSecretKeyNoOneWillFindOut
const secretKey = 'a39c3ef5f1792ec25224e0b22193aa3e4d1f999b998ae34fd6334aeb4326b5c3';
//TheSecretKeyNoOneWillFindOutForAdmins
const secretKeyAdmin = '39b629b395f80a86013180c99c8b6568d7d3fad0b2141169d06b9187bec97bc6';
//endregion

//################################################################################################
//#                                 Handling lokaler Dateien                                     #
//################################################################################################
//region
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
//endregion

//################################################################################################
//#                                   SHA256 Hash Funktion                                       #
//################################################################################################
//region
const { createHash } = require('crypto');
function hash(string) {
    return createHash('sha256').update(string).digest('hex');
}
//endregion

//################################################################################################
//#                                                                                              #
//#                                  Verbindung zum MQTT Server                                  #
//#                                                                                              #
//################################################################################################
//region
const mqtt = require('mqtt');

const client = mqtt.connect('ws://0.0.0.0:8883', {
    clientId: '2'});

client.setMaxListeners(20);

client.on('connect', () => {
    console.log('Connected to MQTT server');

    client.unsubscribe('RED_LED_STATUS_RESPONSE');
    client.unsubscribe('RED_LED_ON_RESPONSE');
    client.unsubscribe('RED_LED_OFF_RESPONSE');
    client.unsubscribe('GREEN_LED_STATUS_RESPONSE');
    client.unsubscribe('GREEN_LED_ON_RESPONSE');
    client.unsubscribe('GREEN_LED_OFF_RESPONSE');
    client.unsubscribe('GET_TEMPERATURE_RESPONSE');

    // Registriere den Websocket Server auf alle Antwort Events
    client.subscribe('RED_LED_STATUS_RESPONSE');
    client.subscribe('RED_LED_ON_RESPONSE');
    client.subscribe('RED_LED_OFF_RESPONSE');
    client.subscribe('GREEN_LED_STATUS_RESPONSE');
    client.subscribe('GREEN_LED_ON_RESPONSE');
    client.subscribe('GREEN_LED_OFF_RESPONSE');
    client.subscribe('GET_TEMPERATURE_RESPONSE');

    // Sende initiale Statusanfrage aller Events
    // client.publish('RED_LED_STATUS_REQUEST', 'true');
    //client.publish('GREEN_LED_STATUS_REQUEST', 'true');
    //client.publish('GET_TEMPERATURE_REQUEST', 'true');
});

client.on('message', (topic, message) => {

    console.log(`Received message from topic ${topic}: ${message.toString()}`);

    const clientId = message.toString().split(':')[0];

    const clientMessage = message.toString().split(':')[1];




    if (topic == "RED_LED_STATUS_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_ON_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };

            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_OFF_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "RED_LED_ON_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_ON_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_ON_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: false
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "RED_LED_OFF_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_OFF_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_OFF_RED_LED_RESPONSE',
                data: {
                    wasSuccessful: false
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "GREEN_LED_STATUS_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_ON_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_OFF_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "GREEN_LED_ON_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_ON_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_ON_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: false
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "GREEN_LED_OFF_RESPONSE")
    {
        if (clientMessage == "true")
        {
            const response = {
                method: 'TURN_OFF_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: true
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else if (clientMessage == "false")
        {
            const response = {
                method: 'TURN_OFF_GREEN_LED_RESPONSE',
                data: {
                    wasSuccessful: false
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }

    else if (topic == "GET_TEMPERATURE_RESPONSE")
    {
        if (clientMessage != "INVALID")
        {
            const response = {
                method: 'GET_TEMPERATURE_RESPONSE',
                data: {
                    wasSuccessful: true,
                    temperature: 24//message.toString()
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }

        else
        {
            const response = {
                method: 'GET_TEMPERATURE_RESPONSE',
                data: {
                    wasSuccessful: false
                }
            };
            if (clients.has(clientId)) {
                clients.get(clientId).send(JSON.stringify(response));
            }
        }
    }


    message = Buffer.from('');
});

client.on('error', (error) => {
    console.error(`Error: ${error}`);
});
//endregion

//################################################################################################
//#                                                                                              #
//#                                  NodeJS Websocket Server                                     #
//#                                                                                              #
//################################################################################################
//region
const WebSocket = require('ws');
const serverAddress = '192.168.0.132';//'172.22.111.100'; //'localhost';
const port = 8008;

const server = app.listen(port, () => {
    console.log(`Server läuft auf http://${serverAddress}:${port}`);
});

const wss = new WebSocket.Server({ server });

const clients = new Map();

wss.on('connection', (ws) => {

    // Generiere und speichere eindeutige Client-ID
    const clientId = Date.now().toString();
    clients.set(clientId, ws);

    ws.on('close', () => {
        clients.delete(clientId);
    });

    ws.on('message', (message) => {
        console.log(`Erhaltene Nachricht: ${message}`);

        try {
            // Versuche die Nachricht als JSON zu parsen
            const data = JSON.parse(message);
            console.log(data);

            if (data["method"] == "LOGIN_REQUEST") {

                // Lese JSON-Datei synchron
                let rawdata = fs.readFileSync('public/accounts.json');

                // Parse die Daten in ein JavaScript-Objekt
                let objekte = JSON.parse(rawdata);

                let accountFound = false;
                let isAdmin = "";

                // Durchlaufe jedes Objekt
                for(let objekt of objekte) {
                    //console.log(objekt["username"]);
                    userHash = hash(objekt["username"]+objekt["password"])
                    // Verarbeiten des Objekts
                    if ( data["data"]["userHash"]== userHash)
                    {
                        accountFound = true;
                        isAdmin = objekt["admin"];
                    }
                }

                let dataToSend = "";

                if (accountFound)
                {
                    userHash = data["data"]["userHash"];
                    const token = jwt.sign({ userHash }, secretKey);

                    let adminToken = "";

                    if (isAdmin == "true")
                    {
                        adminToken = jwt.sign({ userHash }, secretKeyAdmin);
                    }

                    dataToSend = JSON.stringify( {
                        method: "LOGIN_RESPONSE",
                        data: {
                            wasSuccessful: true,
                            userToken: token,
                            adminToken: adminToken,
                            isAdmin: isAdmin,
                            siteToOpen: "dashboard.html"
                        }
                    });


                }
                else
                {
                    dataToSend = JSON.stringify( {
                        method: "LOGIN_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Account does not exist."
                        }
                    });
                }


                console.log(dataToSend);
                ws.send(dataToSend);
            }

            else if (data["method"] == "USER_MANAGEMENT_REQUEST")
            {
                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKeyAdmin);

                    const response = JSON.stringify({
                        method: 'USER_MANAGEMENT_RESPONSE',
                        data: {
                            wasSuccessful: true,
                            siteToOpen: "UserManagement.html"
                        }
                    });
                    ws.send(response);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "USER_MANAGEMENT_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "GET_ACCOUNT_INFORMATION_REQUEST")
            {
                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKeyAdmin);

                    // Lese die JSON-Datei
                    let rawdata = fs.readFileSync('public/accounts.json');
                    // Parse die Daten in ein JavaScript-Objekt
                    let objekte = JSON.parse(rawdata);

                    // Erstelle anzuzeigende Accountinformationen in einer map
                    let accountsToDisplay = JSON.stringify(
                        objekte.map(objekt => ({
                            username: objekt["username"],
                            isAdmin: objekt["admin"]
                        }))
                    );

                    console.log(accountsToDisplay);

                    const response = JSON.stringify({
                        method: 'GET_ACCOUNT_INFORMATION_RESPONSE',
                        data: {
                            wasSuccessful: true,
                            accounts: accountsToDisplay
                        }
                    });
                    ws.send(response);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "GET_ACCOUNT_INFORMATION_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "GET_RED_LED_STATUS_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    console.log("send MQTT Request");

                    client.publish('RED_LED_STATUS_REQUEST', `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "GET_RED_LED_STATUS_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "TURN_ON_RED_LED_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    client.publish('RED_LED_ON_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "TURN_ON_RED_LED_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "TURN_OFF_RED_LED_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    client.publish('RED_LED_OFF_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "TURN_OFF_RED_LED_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "GET_GREEN_LED_STATUS_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    console.log("send MQTT Request");

                    client.publish('GREEN_LED_STATUS_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "GREEN_LED_STATUS_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "TURN_ON_GREEN_LED_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    client.publish('GREEN_LED_ON_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "TURN_ON_GREEN_LED_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "TURN_OFF_GREEN_LED_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    client.publish('GREEN_LED_OFF_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "TURN_OFF_GREEN_LED_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "GET_TEMPERATURE_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);

                    //Sende Request an MQTT Server
                    client.publish('GET_TEMPERATURE_REQUEST',  `${clientId}:true`);

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "GET_TEMPERATURE_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "BACK_TO_MISSION_CONTROL_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKey);
                    const response = {
                        method: 'BACK_TO_MISSION_CONTROL_RESPONSE',
                        data: {
                            wasSuccessful: true,
                            siteToOpen: "dashboard.html"
                        }
                    };

                    ws.send(JSON.stringify(response));

                } catch (error) {
                    const response = JSON.stringify( {
                        method: "BACK_TO_MISSION_CONTROL_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }

            else if (data["method"] == "DELETE_USER_REQUEST")
            {

                try {
                    const decoded = jwt.verify(data["data"]["token"], secretKeyAdmin);

                    // Lese Accounts ein
                    let rawdata = fs.readFileSync('public/accounts.json');

                    // Parse die Daten in ein JavaScript-Objekt
                    let objekte = JSON.parse(rawdata);

                    // Durchlaufe jedes Objekt
                    for(let i = 0; i < objekte.length; i++) {
                        let objekt = objekte[i];
                        userHash = hash(objekt["username"]);

                        console.log("saved: " + userHash);
                        console.log("received: " + data["data"]["userToDeleteHash"]);

                        // Verarbeiten des Objekts
                        if (data["data"]["userToDeleteHash"] == userHash) {
                            objekte.splice(i, 1);

                            let jsonData = JSON.stringify(objekte, null, 2);

                            fs.writeFile('public/accounts.json', jsonData, 'utf8', (err) => {
                                if (err) {
                                    console.log(`Error while deleting: ${err}`);

                                    const response = {
                                        method: 'DELETE_USER_RESPONSE',
                                        data: {
                                            wasSuccessful: false,
                                            siteToOpen: "error.html",
                                            errorText: "Error while deleting"
                                        }
                                    };
                                    ws.send(JSON.stringify(response));
                                }
                                else {
                                    console.log('JSON-Objekt erfolgreich gelöscht.');

                                    const response = {
                                        method: 'DELETE_USER_RESPONSE',
                                        data: {
                                            wasSuccessful: true
                                        }
                                    };
                                    ws.send(JSON.stringify(response));
                                }
                            });
                            break;
                        }
                        console.log(objekt);
                    }
                } catch (error) {
                    const response = JSON.stringify( {
                        method: "DELETE_USER_RESPONSE",
                        data: {
                            wasSuccessful: false,
                            siteToOpen: "error.html",
                            errorText: "Access denied."
                        }
                    });
                    ws.send(response);
                }
            }


        } catch (error) {
            console.error(`Fehler beim Parsen der Nachricht: ${error}`);
        }
    });

    ws.on('error', (error)=>{
        console.log(error);
    });


});

wss.on('error', (err) => {

    console.log(err);

});
//endregion