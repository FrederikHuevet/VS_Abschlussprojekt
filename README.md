# Verteiltes System zur Steuerung eines Arduino Sensor-Aktor-Knotens über ein NodeJS Websocket Server

Das vorliegende Repository beinhaltet die Projektarbeit für das Modul Verteilte Systeme, welche ebenfalls die benotete Prüfungsleistung darstellt. Das Modul Verteilte Systeme ist ein Anpassungsmodul im Masterstudiengang Informatik: Verteilte und Mobile Anwendungen der Hochschule Osnabrück.


Das entwickelte verteilte System besteht primär aus einem NodeJS Websocket Server, einem Mosquitto MQTT Client und einem Arduino Sensor-Aktor-Knoten. Es können sich Clients per Websocket Verbindung mit dem NodeJS Websocketserver verbinden und über diesen einen Arduino Sensor-Aktor-Knoten steuern. Als beispielhafte Sensorik wird ein Temperatursensor verwendet, als Aktorik eine rote und eine grüne LED. Die Kommunikation mit dem Arduino erfolgt über einen Mosquitto MQTT Server als Middleware. Um gewisse Funktionen zu schützen, wurden verschiedene Benutzerrollen eingeführt, die dem Account des Nutzers zugewiesen sind. Die Authentifizierung erfolgt mittels JWT.

### Hinweise zur Installation:

Für die Installation des NodeJS Websocket Servers muss zunächst das entsprechende Projekt heruntergeladen werden. Dieses kann nun beispielsweise mit einer IDE wie WebStorm oder IntelliJ IDEA geöffnet werden. Es gilt zu beachten, dass die aktuelle Node Version auf dem Rechner vorhanden sein muss. Zusätzlich muss die Serveradresse an das lokale Netzwerk angepasst werden. Dies gilt auch für die Clientseite. Unter Verwendung der aktuellen Node Version kann der Server nun über die bekannten Schaltflächen gestartet werden.
Als MQTT Server wird ein Mosquitto Server benötigt, welchen es zu installieren gilt. Ein entsprechende Konfigurationsdatei findet sich im NodeJS Websocket Server Projekt unter Mosquitto Config. Diese Datei muss nun im mosquitto Ordner unter etc/mosquitto abgelegt werden. Der Server kann nun mit dem Command
mosquitto -c *Pfad_zu_mosquitto*/mosquitto/2.0.18/etc/mosquitto/mosquitto.conf -v
gestartet werden.
Weiterhin ist darauf zu achten, dass die verwendeten Ports im Netzwerk freigegeben sind. Voreingestellt ist für den NodeJS Websocket Server der Port 8008 und für den Mosquitto MQTT Server 1883 beziehungsweise 8883 für den Websocket Server.
Als Client sollte ein aktueller Browser verwendet werden. Empfohlen wird Chromium.
