
//################################################################################################
//#                                   SHA256 Hash Funktion                                       #
//################################################################################################
//region
function hash(input) {
    var shaObj = new jsSHA("SHA-256", "TEXT");
    shaObj.update(input);
    var hash = shaObj.getHash("HEX");
    return hash;
}
//endregion

//################################################################################################
//#                                   Websocket Verbindung                                       #
//################################################################################################
//region

const serverAddress = '192.168.0.132'; //'localhost';
wsURI = 'ws://' + serverAddress + ':8008';
var connection = new WebSocket(wsURI);


connection.onopen = async function() {
    console.log('Connected!');

    if (await window.location == "http://" + serverAddress + ":8008/error.html")
    {
        try {
            var errorText = sessionStorage.getItem("errorText");
            document.getElementById("error").innerHTML = errorText;
        }
        catch (error) {
            console.log("error showing errortext");
        }
    }

    if (await window.location == "http://" + serverAddress + ":8008/dashboard.html")
    {
        if(sessionStorage.getItem("userIsAdmin") == "true")
        {
            try {
                var userManagementDiv = document.getElementById('userManagementDiv');

                if (userManagementDiv.style.display == "none" || userManagementDiv.style.display == "")
                {
                    userManagementDiv.style.display = "block";
                }
                else
                {
                    userManagementDiv.style.display = "none";
                }
            }
            catch (error) {

            }

            getRedLedStatus();
            getGreenLedStatus();
        }
    }

    if (await window.location == "http://" + serverAddress + ":8008/UserManagement.html")
    {
        getAccountInformation();
    }

    if(sessionStorage.getItem("jwtTokenUser"))
    {

    }
    else if (await window.location != "http://" + serverAddress + ":8008/error.html")
    {
        if (window.location != "http://" + serverAddress + ":8008/index.html") {
            window.location.href = "http://" + serverAddress + ":8008/index.html";
        }
    }

};

connection.onerror = function(error) {
    console.log('Websocket Error ' + error);
};

connection.onmessage = function(e) {

    let json = JSON.parse(e.data);


    if(json["method"] == "LOGIN_RESPONSE") {

        if(json["data"]["wasSuccessful"] === true)
        {
            if(json["data"]["userToken"] != "") {
                const tokenToSafeUser = json["data"]["userToken"];
                sessionStorage.setItem("jwtTokenUser", tokenToSafeUser);
            }

            if (json["data"]["adminToken"] != "")
            {
                const tokenToSafeAdmin = json["data"]["adminToken"];
                sessionStorage.setItem("jwtTokenAdmin", tokenToSafeAdmin);
            }
            if (json["data"]["isAdmin"] != "")
            sessionStorage.setItem("userIsAdmin", json["data"]["isAdmin"]);


            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }

        }

        else
        {
            if(json["data"]["errorText"] != "") {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "") {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }

        }

    }

    else if (json["method"] == "USER_MANAGEMENT_RESPONSE") {

        if (json["data"]["wasSuccessful"] === true)
        {
            if(json["data"]["accounts"] != "")
            {
                sessionStorage.setItem("accounts", json["data"]["accounts"]);
            }


            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }

        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }
    
    else if (json["method"] == "GET_ACCOUNT_INFORMATION_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            // Lese anzuzeigende Accountinformationen aus
            let accounts = JSON.parse(json["data"]["accounts"]).map(account => ({
                username: account.username,
                isAdmin: (account.isAdmin === "true")
            }));

            // Erstelle Tabelle mit Accountinformationen
            let table = document.getElementById('userdata').getElementsByTagName('tbody')[0];

            // Gehe jeden Account durch und lege einen Tabelleneintrag an
            accounts.forEach(item => {
                let row = table.insertRow();
                let usernameCell = row.insertCell();
                let isAdminCell = row.insertCell();
                let actionCell = row.insertCell();

                let username = item.username;
                usernameCell.textContent = username;

                if (item.isAdmin)
                {
                    isAdminCell.textContent = "Yes";
                    actionCell.innerHTML = '<button class="btn btn-danger" onClick="deleteUser(\'' + username + '\')" disabled>Delete User</button>';
                }

                else {
                    isAdminCell.textContent = "No";
                    actionCell.innerHTML = '<button class="btn btn-danger" onClick="deleteUser(\'' + username + '\')">Delete User</button>';
                }
            });
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

    else if (json["method"] == "TURN_ON_RED_LED_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            document.getElementById('myRedCircle').style.backgroundColor = 'red';
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }

    }

    else if (json["method"] == "TURN_OFF_RED_LED_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            document.getElementById('myRedCircle').style.backgroundColor = 'white';
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

    else if (json["method"] == "TURN_ON_GREEN_LED_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            document.getElementById('myGreenCircle').style.backgroundColor = 'green';
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

    else if (json["method"] == "TURN_OFF_GREEN_LED_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            document.getElementById('myGreenCircle').style.backgroundColor = 'white';
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

    else if (json["method"] == "GET_TEMPERATURE_RESPONSE") {
        if (json["data"]["wasSuccessful"] === true)
        {
            document.getElementById('temperatureValue').value = json["data"]["temperature"];
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

    else if (json["method"] == "BACK_TO_MISSION_CONTROL_RESPONSE") {

        if (json["data"]["wasSuccessful"] === true)
        {
            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }

        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }


    }

    else if (json["method"] == "DELETE_USER_RESPONSE") {

        if (json["data"]["wasSuccessful"] === true)
        {
            location.reload();
        }
        else
        {
            if (json["data"]["errorText"] != "")
            {
                const errorTextReceived = json["data"]["errorText"];
                sessionStorage.setItem("errorText", errorTextReceived);
            }

            if (json["data"]["siteToOpen"] != "")
            {
                window.location.href = "http://" + serverAddress + ":8008/"+json["data"]["siteToOpen"];
            }
        }
    }

};

connection.onclose = function () {
    console.log('DISCONNECTED');
};
//endregion

//################################################################################################
//#                                Funktionen der HTML Seiten                                    #
//################################################################################################
//region

async function deleteUser(username) {
    let userToDeleteHash= await hash(username);

    const ownToken = sessionStorage.getItem("jwtTokenAdmin");

    let data = JSON.stringify( {
        method: "DELETE_USER_REQUEST",
        data: {
            token: ownToken,
            userToDeleteHash: userToDeleteHash
        }
    });
    connection.send(data);
}

async function login() {
    const username = document.getElementById("username").value;
    const userpassword = document.getElementById("userpassword").value;

    let passwordhash = await hash(userpassword);
    const userHash = await hash(username+passwordhash);

    let data = JSON.stringify( {
        "method": "LOGIN_REQUEST",
        "data": {
            "userHash": userHash
        }
    });
    connection.send(data);
}

function logout() {
    sessionStorage.clear();
    window.location = "index.html";
}

function cancel() {
    location.reload();
}

function getTemperature() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "GET_TEMPERATURE_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function getRedLedStatus() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "GET_RED_LED_STATUS_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function turnOnRedLed() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "TURN_ON_RED_LED_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function turnOffRedLed() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "TURN_OFF_RED_LED_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function getGreenLedStatus() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "GET_GREEN_LED_STATUS_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function turnOnGreenLed() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "TURN_ON_GREEN_LED_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function turnOffGreenLed() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "TURN_OFF_GREEN_LED_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function userManagement() {

    const ownToken = sessionStorage.getItem("jwtTokenAdmin");

    let data = JSON.stringify( {
        method: "USER_MANAGEMENT_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function getAccountInformation() {

    const ownToken = sessionStorage.getItem("jwtTokenAdmin");

    let data = JSON.stringify( {
        method: "GET_ACCOUNT_INFORMATION_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}

function backToMissionControl() {

    const ownToken = sessionStorage.getItem("jwtTokenUser");

    let data = JSON.stringify( {
        method: "BACK_TO_MISSION_CONTROL_REQUEST",
        data: {
            token: ownToken
        }
    });
    connection.send(data);
}
//endregion