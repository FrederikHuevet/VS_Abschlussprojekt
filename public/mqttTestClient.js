const mqtt = require('mqtt');
//const client  = mqtt.connect('mqtt://localhost:1883/mqtt');
const client = mqtt.connect('mqtt://localhost:1883', {
    clientId: '3'});
// Die Topics, auf die der Client hören soll
const requestTopics = [
    'RED_LED_STATUS_REQUEST',
    'RED_LED_ON_REQUEST',
    'RED_LED_OFF_REQUEST',
    'GREEN_LED_STATUS_REQUEST',
    'GREEN_LED_ON_REQUEST',
    'GREEN_LED_OFF_REQUEST',
    'GET_TEMPERATURE_REQUEST'
];

// Die entsprechenden Antwort-Topics
const responseTopics = [
    'RED_LED_STATUS_RESPONSE',
    'RED_LED_ON_RESPONSE',
    'RED_LED_OFF_RESPONSE',
    'GREEN_LED_STATUS_RESPONSE',
    'GREEN_LED_ON_RESPONSE',
    'GREEN_LED_OFF_RESPONSE',
    'GET_TEMPERATURE_RESPONSE'
];

client.on('connect', function () {
    console.log('Client connected');

    // Abonnieren Sie alle Anforderungs-Themen
    requestTopics.forEach(topic => {

        client.unsubscribe(topic, function () {
            console.log(`Unsubscribed ${topic}`);
        });
        client.subscribe(topic, function (err) {
            if (!err) {
                console.log(`Subscribed to ${topic}`);
            }
        });
    });
});

client.on('message', function (topic, message) {
    // Überprüfen Sie, ob das empfangene Topic eines der Anforderungs-Themen ist
    const index = requestTopics.indexOf(topic);

    if (index !== -1) {
        // Veröffentlichen Sie `true` auf dem entsprechenden Antwort-Topic
        client.publish(responseTopics[index], message, { qos: 1 });
        console.log(`Received message on ${topic}, responded on ${responseTopics[index]}`);
    }
});
