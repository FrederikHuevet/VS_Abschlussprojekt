/*
  Projekt VS Arduino-Sensorknoten als Mqtt-Client
*/
#include <WiFiS3.h>
#include <PubSubClient.h>
#include "arduino_secrets.h"
#include <DHT.h>
#include <LiquidCrystal.h>

#define DHTPIN 2  // DHT11-Datenpin mit Pin 2 verbunden
#define DHTTYPE DHT11  // Verwendung des DHT11-Sensor

// Deklaration des Sensors
DHT dht(DHTPIN, DHTTYPE);

// Netzwerk-Anmeldedaten im tab/arduino_secrets.h hinterleget
char ssid[] = SECRET_SSID;    // Netzwerk Name
char pass[] = SECRET_PASS;    // Netzwerk Passwort

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

// Mqtt-Broker Daten
const char* mqtt_broker = "192.168.206.17";
const int mqtt_port = 1883;
const char* mqtt_client_id = "arduino_client";

// Topics, auf die der Arduino hören soll
const char* requestTopics[] = {
    "RED_LED_STATUS_REQUEST",
    "RED_LED_ON_REQUEST",
    "RED_LED_OFF_REQUEST",
    "GREEN_LED_STATUS_REQUEST",
    "GREEN_LED_ON_REQUEST",
    "GREEN_LED_OFF_REQUEST",
    "GET_TEMPERATURE_REQUEST"
};

// Die entsprechenden Antwort-Topics
const char* responseTopics[] = {
    "RED_LED_STATUS_RESPONSE",
    "RED_LED_ON_RESPONSE",
    "RED_LED_OFF_RESPONSE",
    "GREEN_LED_STATUS_RESPONSE",
    "GREEN_LED_ON_RESPONSE",
    "GREEN_LED_OFF_RESPONSE",
    "GET_TEMPERATURE_RESPONSE"
};

// Aktualisierungs-Interval kann entsprechend angepasst werden
const long interval = 5000;
unsigned long previousMillis = 0;

// LCD-Display
LiquidCrystal lcd(7, 8, 9, 10, 11, 12);

// LED-Control
int ledPin_green = A0;
//int buttonApin = A1;
//int buttonBpin = A2;
int ledPin_red = 4;
//int buttonCpin = 5;
//int buttonDpin = 6;

void setup() 
{
  //Initialize serial and wait for port to open:
  Serial.begin(9600);
  while (!Serial) 
  {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // Attempt to connect to WiFi network:
  Serial.print("Attempting to connect to WPA SSID: ");
  Serial.println(ssid);
  while (WiFi.begin(ssid, pass) != WL_CONNECTED) 
  {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }

  Serial.println("You're connected to the network");
  Serial.println();

  // Set MQTT server and callback function
  mqttClient.setServer(mqtt_broker, mqtt_port);
  mqttClient.setCallback(callback);

  // Attempt to connect to MQTT broker
  while (!mqttClient.connected()) 
  {
    Serial.print("Attempting to connect to the MQTT broker: ");
    Serial.println(mqtt_broker);
    // Attempt to connect
    if (mqttClient.connect(mqtt_client_id)) 
    {
      Serial.println("You're connected to the MQTT broker!");
      // Subscribe to all request topics
      for (int i = 0; i < sizeof(requestTopics) / sizeof(requestTopics[0]); i++) {
        mqttClient.subscribe(requestTopics[i]);
        Serial.print("Subscribed to ");
        Serial.println(requestTopics[i]);
      }
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }

  // Initialisierung DHT-Sensor
  dht.begin();  

  // Ausgabe der Nachricht auf dem LCD-Display
  lcd.begin(16, 2);
  lcd.print("Temperature:");
  lcd.setCursor(0, 1);
  lcd.print("     deg. C");

  // Initialize LED Control
  pinMode(ledPin_green, OUTPUT);
  //pinMode(buttonApin, INPUT_PULLUP);  
  //pinMode(buttonBpin, INPUT_PULLUP);
  pinMode(ledPin_red, OUTPUT);
  //pinMode(buttonCpin, INPUT_PULLUP);  
  //pinMode(buttonDpin, INPUT_PULLUP);
}

void loop() 
{
  mqttClient.loop();

  unsigned long currentMillis = millis();
  
  if (currentMillis - previousMillis >= interval) {
    // save the last time a message was sent
    previousMillis = currentMillis;

    // Temperatur vom DHT-Sensor auslesen
    float temperature = dht.readTemperature();  

    // Ausgabe der Nachrichten auf dem Serial Monitor
    //Serial.print("Sending message to topic: ");
    //Serial.println(topic);
    //Serial.print( "T = " );
    //Serial.print(temperature);
    //Serial.print( " deg. C");

    // Ausgabe der Temperatur auf dem LCD-Display
    lcd.setCursor(0, 1);
    lcd.print(temperature, 1);
  }

  /* Green LED Control
  if (digitalRead(buttonApin) == LOW)
  {
    digitalWrite(ledPin_green, HIGH);
  }
  if (digitalRead(buttonBpin) == LOW)
  {
    digitalWrite(ledPin_green, LOW);
  }

  // Red LED Control
  if (digitalRead(buttonCpin) == LOW)
  {
    digitalWrite(ledPin_red, HIGH);
  }
  if (digitalRead(buttonDpin) == LOW)
  {
    digitalWrite(ledPin_red, LOW);
  }
  */
}

void callback(char* topic, byte* payload, unsigned int length) 
{
  //Callback-Funktion für eingehende MQTT-Nachrichten
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");

  // Convert payload to string
  String message;
  for (int i = 0; i < length; i++) 
  {
    message += (char)payload[i];
  }
  Serial.println(message);

  // Überprüfen, ob das empfangene Topic eines der Anforderungs-Themen ist
  for (int i = 0; i < sizeof(requestTopics) / sizeof(requestTopics[0]); i++) 
  {
    if (strcmp(topic, requestTopics[i]) == 0) 
    {
      // Veröffentlichen eines `true` auf das Antwort-Topic
      mqttClient.publish(responseTopics[i], message.c_str());
      Serial.print("Responded on ");
      Serial.println(responseTopics[i]);
      // Ausführen der entsprechenden Aktion
      performAction(requestTopics[i], message);
      break;
    }
  }
}

void performAction(const char* topic, String message) 
{
  if (strcmp(topic, "RED_LED_STATUS_REQUEST") == 0) 
  {
    // Abfrage des Status der roten LED und antworten
    bool redLedStatus = digitalRead(ledPin_red);
    if (redLedStatus) 
    {
      // "RED_LED_ON_RESPONSE"
      mqttClient.publish(responseTopics[1], message.c_str());
    } else 
    {
      // "RED_LED_OFF_RESPONSE"
      mqttClient.publish(responseTopics[2], message.c_str());
    }
  } else if (strcmp(topic, "RED_LED_ON_REQUEST") == 0) 
  {
    // Rote LED einschalten
    digitalWrite(ledPin_red, HIGH);
  } else if (strcmp(topic, "RED_LED_OFF_REQUEST") == 0) 
  {
    // Rote LED ausschalten
    digitalWrite(ledPin_red, LOW);
  } else if (strcmp(topic, "GREEN_LED_STATUS_REQUEST") == 0) 
  {
    // Abfrage des Status der grünen LED und antworten
    bool greenLedStatus = digitalRead(ledPin_green);
    if (greenLedStatus) 
    {
      // "GREEN_LED_ON_RESPONSE"
      mqttClient.publish(responseTopics[4], message.c_str());
    } else 
    {
      // "GREEN_LED_OFF_RESPONSE"
      mqttClient.publish(responseTopics[5], message.c_str());
    }
  } else if (strcmp(topic, "GREEN_LED_ON_REQUEST") == 0) 
  {
    // Grüne LED einschalten
    digitalWrite(ledPin_green, HIGH);
  } else if (strcmp(topic, "GREEN_LED_OFF_REQUEST") == 0) 
  {
    // Grüne LED ausschalten
    digitalWrite(ledPin_green, LOW);
  } else if (strcmp(topic, "GET_TEMPERATURE_REQUEST") == 0) 
  {
    // Temperatur auslesen und antworten
    float temperature = dht.readTemperature();
    String temperatureStr = String(temperature);
    
    // Veröffentlichen von "message" und "temperature" auf das Antwort-Topic
    String combinedMessage = message + ":" + temperatureStr + " °C";
    mqttClient.publish(responseTopics[6], combinedMessage.c_str());

  }
}
