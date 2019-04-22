#include <Arduino.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFi.h>
#include <LinkedList.h>
#include "DHT.h"
#include <PID_v1.h>
#include <math.h>
#include <LiquidCrystal_I2C.h>

/////////////////////////////////////////////////////////////////////////////////////////////////////
#define sendInterval 30000
#define pourInterval 7000
#define lcdInterval 5000
unsigned long previousMillisSend = 0;
unsigned long previousMillisPour = 0;
unsigned long btnSec = 0;
  

//////////////////////////////////////////////// SENSOR PIN SETUP /////////////////////////////////////
#define soilHum 35
#define waterSurf 34
#define pump 24
#define humidityTemperatureAir 23
#define vccHum 32
#define vccWat 4 
#define LCD_SCL 22
#define LCD_SDA 21
#define lcdBtn 5

///////////////////////////////////////////////////////////////////////////////////////////////////////
SocketIoClient webSocket;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);
DHT dht(humidityTemperatureAir, DHT11);
LinkedList<char*> offlineData;
LiquidCrystal_I2C lcd(0x27,16,2);

////////////////////////////////////////////////// SETUP /////////////////////////////////////////////
void setup() {
    Serial.begin(9600);

    Serial.setDebugOutput(true);

    Serial.println();
    Serial.println();
    Serial.println();

      for(uint8_t t = 4; t > 0; t--) {
          Serial.printf("[SETUP] BOOT WAIT %d...\n", t);
          Serial.flush();
          delay(1000);
      }

    //Connection to WIFI   
    Serial.print("Connecting to Wifi");
    WiFi.mode(WIFI_AP_STA);
    WiFi.beginSmartConfig();

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
        Serial.println(WiFi.smartConfigDone());
    }

    Serial.println("");
    Serial.println("WiFi connected.");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.println(WiFi.SSID(0));
    
  
    //establish time client
    timeClient.begin();
    timeClient.setTimeOffset(3600);

    //establish socketIO connection
    webSocket.begin("147.232.158.152", 1205, "/socket.io/?transport=websocket");
    webSocket.on("disconnect", disconection);
    webSocket.on("connect", conection);

    //socket event on 
    webSocket.on("water", pourFlower);
    //webSocket.on("soilHumidity", getMaxMin);
    
    //PIN INITALIZATION
    pinMode(pump, OUTPUT);
    pinMode(vccHum, OUTPUT);
    pinMode(vccWat, OUTPUT);
    pinMode(lcdBtn, INPUT);
    
    //LCD INITALIZATION
    lcd.init();  
    lcd.noDisplay();                    
}

/////////////////////////////////////////// WIFI reconection /////////////////////////////////////
void wifiConection() {
 if (WiFi.status() != WL_CONNECTED) {

    WiFi.beginSmartConfig();
    delay(500);
    Serial.print(".");
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("");
      Serial.println("WiFi connected.");
      Serial.println("IP address: ");
      Serial.println(WiFi.localIP());

      timeClient.begin();
      timeClient.setTimeOffset(3600);
    
      //establish socketIO connection
      webSocket.begin("147.232.158.152", 1205, "/socket.io/?transport=websocket");
      webSocket.on("disconnect", disconection);
      webSocket.on("connect", conection);
  
      //socket event on 
      webSocket.on("water", pourFlower);
    }
  }
}

////////////////////////////////////////// MEASURE DATA ////////////////////////////////////////////
void measureData() {
  float temperature = getTemperature(); 
  float humidityAir = getHumidity();
  float humiditySoil = getSoilHumidity();
  float waterSurface = getWaterSurface();

  createJson(temperature, humidityAir, humiditySoil, waterSurface);
}


//////////////////////////////////////// SENSORS FUNCTIONS ////////////////////////////////////////
//DATE
String getDate() {
  while(!timeClient.update()) {
    timeClient.forceUpdate();
  }
  
  String formattedDate = timeClient.getFormattedDate();
  int splitT = formattedDate.indexOf("T");
  String dayStamp = formattedDate.substring(0, splitT);
  String timeStamp = formattedDate.substring(splitT+1, formattedDate.length()-1);
  String date = dayStamp +" "+ timeStamp;

  return date;
}


//SOILHUMIDITY
float getSoilHumidity() {
  digitalWrite(vccHum, HIGH);
  delay(100);
  float soilHumidity = analogRead(soilHum);
  delay(100);
  digitalWrite(vccHum, LOW);
  return round((100 - (soilHumidity / 41)));
}

//WATER SURFACE
float getWaterSurface(){
  digitalWrite(vccWat, HIGH);
  delay(100);
  float waterSurface = analogRead(waterSurf);
  delay(100);
  digitalWrite(vccWat, LOW);
  return round(waterSurface / 41);
}

//AIR TEMPERATURE
float getTemperature(){
  float temperature = dht.readTemperature();
  return temperature;
}

//AIR HUMIDITY
float getHumidity(){
  float humidity = dht.readHumidity();
  return humidity;
}

//////////////////////////////////////// JSON Creation /////////////////////////////////////////////////
void createJson(float temperature, float humidityAir, float humiditySoil, float waterSurface) {
    const size_t capacity = JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(2) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(4);
    DynamicJsonBuffer jsonBuffer(capacity);
    
    JsonObject& root = jsonBuffer.createObject();
    
    JsonObject& identification = root.createNestedObject("identification");
    byte mac[6];
    WiFi.macAddress(mac);
    identification["id"] = (String(mac[0], HEX) + ":" + String(mac[1], HEX) + ":" + String(mac[2], HEX) + ":" + String(mac[3], HEX) + ":" + String(mac[4], HEX) + ":" + String(mac[5], HEX));
    
    JsonObject& info = root.createNestedObject("info");
    info["temperature"] = temperature;
    info["humidityAir"] = humidityAir;
    info["humiditySoil"] = humiditySoil;
    info["watersurface"] = waterSurface;
    
    JsonObject& date = root.createNestedObject("date");
    date["date"] = getDate();
    
    char output[capacity];
    root.printTo(output);
    sendData(output);
}

//////////////////////////////////////////// SOCKETIO EVENTS //////////////////////////////////

// SEND DATA
void sendData(char* output) {
   if(WiFi.status() != WL_CONNECTED) {
    if(offlineData.size() != 48) {
      offlineData.add(output);   
      Serial.println("Element added");
      Serial.println(offlineData.size());
    }
    else
       Serial.println("Linked list is full");
   }
   else{
     while(offlineData.size() > 0){
         char* lastElement = offlineData.pop();
         webSocket.emit("arduinoData", lastElement);
         Serial.println("LinkedList data sended.");
     }
     webSocket.emit("arduinoData", output);
     Serial.println("Data sended.");
    }
}

// POUR WATER
void pourFlower(const char * payload, size_t length) {
  Serial.println("Pour flower");
  startPump();
}

//CONNECTION
void conection(const char * payload, size_t length) {
  Serial.println("Client connected to server.");
  webSocket.emit("join", "\"arduinoclient\"");
  webSocket.emit("getSoilHumidity");
}

//DISONNECTION
void disconection(const char * payload, size_t length) {
   Serial.println("Client disconnected from server.");
   webSocket.begin("147.232.158.152", 1205, "/socket.io/?transport=websocket");
   webSocket.emit("join", "\"arduinoclient\"");
   webSocket.emit("getSoilHumidity");
}

//PUMP
void startPump() {
  digitalWrite(pump, HIGH);
  delay(7000);
  digitalWrite(pump, LOW); 
  measureData();   
} 

///////////////////////////////////// LCD AND LED ///////////////////////////////////////////////////
 
//SET LCD DISPLAY 
void setLcd() {
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Humidity: " + String(getSoilHumidity()));

  for(int i = 0; i<3; i++) {
    delay(5000);
       switch(i) {
        case 0:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("Temperature: " + String(getTemperature()) + "%");
          break;
        case 1:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("SoilHumidity:" + String(getSoilHumidity()) + "%");
          break;
        case 2:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("WaterLevel: " + String(getWaterSurface()) + "%");
          break;
      } 
    }
}

/////////////////////////////////////////////// MAIN LOOP ///////////////////////////////////////////
void loop() {
    webSocket.loop();
    wifiConection();

    if (digitalRead(lcdBtn))
      setLcd();
    else {
      lcd.noDisplay();
      lcd.noBacklight();
    }    
    
    if (millis() - previousMillisSend >= sendInterval) {
      previousMillisSend = millis();    
      measureData();
    }
}
