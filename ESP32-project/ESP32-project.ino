#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "ESP32";
const char* password =  "glifosensor";

int humedad = 0;
int temperatura = 42;
float coords[2] = {-34.554966,-58.361135};

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(4000);   
 
  WiFi.begin(ssid, password); 

  
   while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(500);
    Serial.println("Connecting..");
  }

  Serial.print("Connected to the WiFi network with IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:

   if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
    HTTPClient http;

    DynamicJsonDocument jsonDocument(1024);
    jsonDocument["name"] = "sENSOR";
    JsonArray mediciones = jsonDocument.createNestedArray("coords");
    mediciones.add(coords[0]);
    mediciones.add(coords[1]);
    jsonDocument["temperatura"] = temperatura;    
    jsonDocument["humedad"] = humedad;
    jsonDocument["co2"] = 1;
    

    
    String jsonString;
    serializeJson(jsonDocument, jsonString);

 // Serial.println(jsonString);

 
    http.begin("http://192.168.116.6:3000/sensor");  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");             //Specify content-type header
    
    int httpResponseCode = http.POST(jsonString);
   // int httpResponseCode = http.POST("{\"name\":\"Sensor\",\"temperatura\":\"22\",\"humedad\":\"24\",\"co2\":\"1\",\"coords\":\"[-34.554966,-58.361135]\"}");   //Send the actual POST request
  // int httpResponseCode = http.GET();
 
    if(httpResponseCode>0){
 
      Serial.println(httpResponseCode);   //Print return code
      Serial.println(http.getString());
    }else{
 
      Serial.print("Error on sending request: ");
      Serial.println(httpResponseCode);
 
   }
 
   http.end();  //Free resources
 
 }else{
 
    Serial.println("Error in WiFi connection");   
 
 }
 
  delay(27418000);  //Send a request every 5 seconds
}
