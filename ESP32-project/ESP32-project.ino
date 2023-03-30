#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <DHT.h>

// instalar dht sensor library y arduinoJSON para correr el programa
// para usar la tarjeta esp32 poner en preferencias este link: https://dl.espressif.com/dl/package_esp32_index.json, http://arduino.esp8266.com/stable/package_esp8266com_index.json

#define DHTPIN 13
#define DHTTYPE DHT11

// Aca va el nombre del sensor
char* nombre = "sENSOR";

DHT dht(DHTPIN, DHTTYPE);



const char* ssid = "ESP32";
const char* password =  "glifosensor";

float coords[2] = {-34.554966,-58.361135};

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  delay(4000);   
  dht.begin();
  WiFi.begin(ssid, password); 
  WiFi.mode(WIFI_STA);
  
   while (WiFi.status() != WL_CONNECTED) { //Check for the connection
    delay(500);
    Serial.println("Connecting..");
  }

  Serial.print("Connected to the WiFi network with IP: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // put your main code here, to run repeatedly:

  //int chk = DHT11.read(DHT11PIN);
   if(WiFi.status()== WL_CONNECTED){   //Check WiFi connection status
 
    HTTPClient http;
    DynamicJsonDocument jsonDocument(1024);
    jsonDocument["name"] = nombre;
    JsonArray mediciones = jsonDocument.createNestedArray("coords");
    mediciones.add(coords[0]);
    mediciones.add(coords[1]);
    jsonDocument["temperatura"] = dht.readTemperature(); 
    jsonDocument["humedad"] = dht.readHumidity();
    jsonDocument["co2"] = 1;

    Serial.println( dht.readHumidity());
   Serial.println( dht.readTemperature());
    

    

    
    String jsonString;
    serializeJson(jsonDocument, jsonString);

   Serial.println(jsonString);

 
    http.begin("http://192.168.232.6:3000/sensor");  //Specify destination for HTTP request
    http.addHeader("Content-Type", "application/json");             //Specify content-type header
    
    //int httpResponseCode = http.POST(jsonString);
   // int httpResponseCode = http.POST("{\"name\":\"Sensor\",\"temperatura\":\"22\",\"humedad\":\"24\",\"co2\":\"1\",\"coords\":\"[-34.554966,-58.361135]\"}");   //Send the actual POST request
   int httpResponseCode = http.GET();
 
    if(httpResponseCode>0){
 
      Serial.println(httpResponseCode);   //Print return code
      
     String jsonResponse = http.getString();
     Serial.println(jsonResponse);
     
     DynamicJsonDocument doc(1024);
     deserializeJson(doc, jsonResponse);
     
     for(int i = 0; i<doc.size(); i++){
        if (doc[i]["name"] == nombre){
            const String id = doc[i]["_id"];
            http.end();
            String url = "http://192.168.232.6:3000/sensor/"+id;
            putHttp(url, jsonString); 
          }
      }
    }else{
 
      Serial.print("Error on sending request: ");
      Serial.println(httpResponseCode);
      
      
   }

  
   http.end();  //Free resources
 
 }else{
 
    Serial.println("Error in WiFi connection");   
 
 }
 
  delay(5000);  //Send a request every 5 seconds
}

void putHttp(String url, String json){
    HTTPClient http;
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.PUT(json);
  
  if(httpResponseCode>0){
 
      Serial.println(httpResponseCode);   //Print return code
      
    }else{
 
      Serial.print("Error on sending request: ");
      Serial.println(httpResponseCode);
      
      
   }

   http.end();
  
}
