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
#include <EEPROM.h>
//#include <ArduinoLowPower.h>

/////////////////////////////////////////////////////////////////////////////////////////////////////
#define sendInterval 30000
#define pourInterval 5000
#define lcdInterval 5000

unsigned long previousMillisSend = 0;
unsigned long previousMillisPour = 0;
unsigned long btnSec = 0;
int sleepTime = 30000;

const int freq = 5000;
const int redChannel = 0;
const int blueChannel = 1;
const int greenChannel = 2;
const int resolution = 8;

static char ssid[33] = {0}; 
static char password[65] = {0};

int minHumidity = 0;

//////////////////////////////////////////////// SENSOR PIN SETUP /////////////////////////////////////
#define soilHum 35
#define waterSurf 34
#define pump 27
#define humidityTemperatureAir 23
#define vccHum 32
#define vccWat 4 

#define LCD_SCL 22
#define LCD_SDA 21
#define lcdBtn 2

#define pinR 19
#define pinG 18
#define pinB 17

#define SSID_EEPROM_ADDRESS 0
#define PASSWORD_EEPROM_ADDRESS sizeof(ssid)

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
    Serial.println(WiFi.SSID());
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());

    saveWifiData(WiFi.psk(), WiFi.SSID());
    
    //establish time client
    timeClient.begin();
    timeClient.setTimeOffset(3600);

    //establish socketIO connection
    webSocket.begin("192.168.1.14", 1205, "/socket.io/?transport=websocket");
    webSocket.on("disconnect", disconection);
    webSocket.on("connect", conection);

    //socket event on 
    webSocket.on("water", pourFlower);
    webSocket.on("humidity", getMin);

    lcd.init();
    lcd.backlight();
    
    //PIN INITALIZATION
    pinMode(pump, OUTPUT);
    pinMode(vccHum, OUTPUT);
    //pinMode(vccWat, OUTPUT);
    pinMode(lcdBtn, INPUT);             

    //RGB LED
    ledcSetup(redChannel, freq, resolution);
    ledcSetup(blueChannel, freq, resolution);
    ledcSetup(greenChannel, freq, resolution);
    
    ledcAttachPin(pinR, redChannel);
    ledcAttachPin(pinB, blueChannel);
    ledcAttachPin(pinG, greenChannel);
}
/////////////////////////////////////////// SAVE WIFI DATA TO EEPROM /////////////////////////////
void saveWifiData(String PASSWORD, String SSIDd) {
  PASSWORD.toCharArray(password,sizeof(password));
  SSIDd.toCharArray(ssid,sizeof(ssid));

  EEPROM.put(SSID_EEPROM_ADDRESS, ssid);
  EEPROM.put(PASSWORD_EEPROM_ADDRESS, password);
}

void getWiFiSettings(String * PASSWORD, String * SSID1)
{
  EEPROM.get(SSID_EEPROM_ADDRESS, ssid);
  EEPROM.get(PASSWORD_EEPROM_ADDRESS, password);

  * PASSWORD = String(password);
  * SSID1 = String(ssid);
  Serial.println(*SSID1);
  Serial.println(*PASSWORD);
}

/////////////////////////////////////////// WIFI reconection /////////////////////////////////////
void wifiConection() {
 if (WiFi.status() != WL_CONNECTED) { 
    String PASS = "";
    String SSID1 = "";
    getWiFiSettings(&PASS, &SSID1);

    PASS.toCharArray(password, 65);
    SSID1.toCharArray(ssid, 33);
    
    WiFi.begin(ssid, password);
    
    if (WiFi.status() == WL_CONNECTED) {
      Serial.println("");
      Serial.println("WiFi connected.");
      Serial.println("IP address: ");
      Serial.println(WiFi.localIP());

      timeClient.begin();
      timeClient.setTimeOffset(3600);
    
      //establish socketIO connection
      webSocket.begin("192.168.0.100", 1205, "/socket.io/?transport=websocket");
      webSocket.on("disconnect", disconection);
      webSocket.on("connect", conection);
  
      //socket event on 
      webSocket.on("water", pourFlower);
      webSocket.on("soilHumidity", getMin);
    }
  }
}

////////////////////////////////////////// MEASURE DATA ////////////////////////////////////////////
void measureData() {
  float temperature = getTemperature(); 
  float humidityAir = getHumidity();
  float humiditySoil = getSoilHumidity();
  float waterSurface = getWaterSurface();
  String date = getDate();
  Serial.println(date);

  createJson(temperature, humidityAir, humiditySoil, waterSurface, date);
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
  Serial.println(date);
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
void createJson(float temperature, float humidityAir, float humiditySoil, float waterSurface, String dateS) {
  const size_t capacity = 2*JSON_OBJECT_SIZE(1) + JSON_OBJECT_SIZE(3) + JSON_OBJECT_SIZE(4);
  DynamicJsonDocument doc(capacity);
  
  JsonObject identification = doc.createNestedObject("identification");
  identification["ArduinoSerial"] = 4568;
  
  JsonObject info = doc.createNestedObject("info");
  info["Temp"] =  temperature;
  info["AirHum"] = humidityAir;
  info["SoilHum"] = humiditySoil;
  info["WatSurf"] = waterSurface;
  JsonObject date = doc.createNestedObject("date");
  date["Date"] = dateS;

  char output[capacity];
  serializeJson(doc, output);

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
  webSocket.emit("setIdentifierA", "{\"ArduinoSerial\":\"4568\"}");
  webSocket.emit("getSoilHumidity", "{\"ArduinoSerial\":\"4568\"}");
}

//DISONNECTION
void disconection(const char * payload, size_t length) {
   Serial.println("Client disconnected from server.");
   webSocket.begin("192.168.0.100", 1205, "/socket.io/?transport=websocket");
   webSocket.emit("getSoilHumidity");
}

//PUMP
void startPump() {
  digitalWrite(pump, HIGH);
  delay(7000);
  digitalWrite(pump, LOW); 
  measureData();   
} 

void getMin(const char* payload, size_t length) {
  const size_t capacity = JSON_ARRAY_SIZE(1) + JSON_OBJECT_SIZE(1) + 20;
  DynamicJsonDocument doc(capacity);

  Serial.println(payload);

  deserializeJson(doc, payload);  
  int SoilHumMin = doc[0]["SoilHumMin"];
  Serial.println("Min Hum: " + SoilHumMin);

  minHumidity = SoilHumMin;
}

///////////////////////////////////// LCD AND LED ///////////////////////////////////////////////////
 
//SET LCD DISPLAY 
void setLcd() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0,0);
  lcd.print("Air Humidity: ");
  lcd.setCursor(0,1);
  lcd.print(String(getHumidity()) + "%");
  delay(5000); 
  
  for(int i = 0; i<3; i++) {
       switch(i) {
        case 0:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("Temperature: ");
          lcd.setCursor(0,1);
          lcd.print(String(getTemperature()) + "°C");
          break;
        case 1:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("Soil Humidity:");
          lcd.setCursor(0,1);
          lcd.print(String(getSoilHumidity()) + "%");
          break;
        case 2:
          lcd.clear();
          lcd.setCursor(0,0);
          lcd.print("WaterLevel: ");
          lcd.setCursor(0,1);
          lcd.print(String(getWaterSurface()) + "%");
          break;
      }
      delay(5000); 
    }
}

//RGB LED
void setRGBLed(float waterLevel) {
    if(waterLevel < 25) {
      ledcWrite(redChannel, 255);
    }
    else if(waterLevel >= 100) {
      ledcWrite(greenChannel, 255);
    } else if(waterLevel > 75) {
      ledcWrite(redChannel, 129);
      ledcWrite(greenChannel, 196);
      ledcWrite(blueChannel, 117);
    } else if(waterLevel > 50) {
      ledcWrite(redChannel, 249);
      ledcWrite(greenChannel, 19);
      ledcWrite(blueChannel, 19);
    } else {
      ledcWrite(redChannel, 255);
    }
}
/////////////////////////////////////////////// SLEEP ARDUINO ///////////////////////////////////////
//void sleepArduino() {
//  Serial.println("Sleep"); 
//  LowPower.sleep(sleepTime);
//}

/////////////////////////////////////////////// MAIN LOOP ///////////////////////////////////////////
void loop() {
    //sleepArduino();
    
    wifiConection();
    webSocket.loop();

    setRGBLed(30);
    
    if (digitalRead(lcdBtn)){
      setLcd();
      Serial.println("click");
    }
    else {
      lcd.noDisplay();
      lcd.noBacklight();
    }    
    
    if (millis() - previousMillisSend >= sendInterval) {
      previousMillisSend = millis();    
      measureData();
      if (minHumidity < getSoilHumidity()) {
        //startPump();
      }
    }
}
