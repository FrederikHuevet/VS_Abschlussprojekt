# Verteiltes System zur Steuerung eines Arduino Sensor-Aktor-Knotens über ein NodeJS Websocket Server

Das vorliegende Repository beinhaltet die Projektarbeit für das Modul Verteilte Systeme, welche ebenfalls die benotete Prüfungsleistung darstellt. Das Modul Verteilte Systeme ist ein Anpassungsmodul im Masterstudiengang Informatik: Verteilte und Mobile Anwendungen der Hochschule Osnabrück.

Das entwickelte verteilte System besteht primär aus einem NodeJS Websocket Server, einem Mosquitto MQTT Client und einem Arduino Sensor-Aktor-Knoten. Es können sich Clients per Websocket Verbindung mit dem NodeJS Websocketserver verbinden und über diesen einen Arduino Sensor-Aktor-Knoten steuern. Als beispielhafte Sensorik wird ein Temperatursensor verwendet, als Aktorik eine rote und eine grüne LED. Die Kommunikation mit dem Arduino erfolgt über einen Mosquitto MQTT Server als Middleware. Um gewisse Funktionen zu schützen, wurden verschiedene Benutzerrollen eingeführt, die dem Account des Nutzers zugewiesen sind. Die Authentifizierung erfolgt mittels JWT.

<img src='https://github.com/FrederikHuevet/VS_Abschlussprojekt/blob/main/Distributed_System_Topology_XL.png' align: center>

### Hinweise zur Installation:

Für die Installation des NodeJS Websocket Servers muss zunächst das entsprechende Projekt heruntergeladen werden. Dieses kann nun beispielsweise mit einer IDE wie WebStorm oder IntelliJ IDEA geöffnet werden. Es gilt zu beachten, dass die aktuelle Node Version auf dem Rechner vorhanden sein muss. Zusätzlich muss die Serveradresse an das lokale Netzwerk angepasst werden. Dies gilt auch für die Clientseite. Unter Verwendung der aktuellen Node Version kann der Server nun über die bekannten Schaltflächen gestartet werden.
Als MQTT Server wird ein Mosquitto Server benötigt, welchen es zu installieren gilt. Ein entsprechende Konfigurationsdatei findet sich im Unterordner ```Mosquitto Config```. Diese Datei muss nun im mosquitto Ordner unter ```etc/mosquitto``` abgelegt werden. Der Server kann nun mit dem Command ```mosquitto -c *Pfad_zu_mosquitto*/mosquitto/2.0.18/etc/mosquitto/mosquitto.conf -v``` gestartet werden. 

Weiterhin ist darauf zu achten, dass die verwendeten Ports im Netzwerk freigegeben sind. Voreingestellt ist für den NodeJS Websocket Server der Port 8008 und für den Mosquitto MQTT Server 1883 beziehungsweise 8883 für den Websocket Server.
Als Client sollte ein aktueller Browser verwendet werden. Empfohlen wird Chromium.

Zur Konfiguration des Arduino-Sensor-Aktor-Knoten muss der Programmcode an das entsprechende Netzwerk angepasst werden. Der Programmcode ist im Unterordner ```Arduino_Sensor_Aktor_Sensorknoten``` verfügbar. Dieser Programmcode kann optimal mit der Arduino IDE geöffnet werden, da diese die notwendigen Abhängigkeiten automatisch installiert und die entsprechenden Bibliotheken schnell hinzugefügt werden können. Zusätzlich müssen auf dem Arduino die Anmeldeinformationen (Credentials) für das jeweilige Netzwerk in der Datei ```arduino_secrets.h``` entsprechend angepasst werden. Diese Anpassungen sind erforderlich, um eine Verbindung zum WLAN-Netzwerk herzustellen, über das der MQTT-Client mit dem Broker kommuniziert. Dabei sollten SSID (Service Set Identifier) und PASS (Passwort) entsprechend den Konfigurationen des lokalen Netzwerks eingetragen werden.

### Sonstige Hinweise:

In den Unterordnern ```alte_HTML_Seiten``` und ```neue_HTML_Seiten``` finden sich die verwendeten HTML-Seiten in unterschiedlichen Designs. ```alte_HTML_Seiten``` beinhaltet die originalen HTML-Seiten, welche auch innerhalb der Prüfungsleistung verwendet werden. ```neue_HTML_Seiten``` beinhaltet mit Bootstrap optimierte HTML-Seiten, die zu Testzwecken verwendet werden können. Diese sind nicht Teil der Prüfungsleistung!

Im Unterordner ```public```findet sich mit ```mqttTestClient.js``` eine Simulation des Arduino Sensor-Aktor-Knotens als MQTT CLient. Dieser sendet die erhaltenen Nachrichten unter den Request Topics auf den Response Topics zurück. Um das System in einer simulierten Umgebung zu testen, muss neben dem NodeJS Websocket Server und Mosquitto Server auch  ```mqttTestClient.js``` gestartet werden. Zusätzlich muss im NodeJS Websocket Server in der Nachrichtenbehandlung des ```GET_TEMPERATURE_RESPONSE``` Topics vom Mosquitto Server die Weiterleitung des Temperaturwertes auf einen hart-gecodedeten Wert angepasst werden.
