#include <dht11.h>
#define DHT11PIN 7
#include <SPI.h>
#include <Ethernet.h>
#include <HttpClient.h>

dht11 DHT11;

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
IPAddress ip(192, 168, 1, 112);
IPAddress server(127, 0, 0, 1);
int port = 3000;

EthernetClient client;
HttpClient http(client, server, port);

void
  setup()
{
  Ethernet.begin(mac, ip);
  Serial.begin(9600);
 
}

void loop()
{
  Serial.println();
  int chk = DHT11.read(DHT11PIN);
  Serial.print((float)DHT11.humidity, 2);
  Serial.print(",");
  Serial.print((float)DHT11.temperature, 2);
  
  String data = "{\"humedad\": " + String(DHT11.humidity) + ", \"temperatura\": " + String(DHT11.temperature) + "}";
  http.put("/sensor/64053885ef6a3fdb8ffd6323", "application/json", data);

  Serial.println(http.responseBody());
  delay(2000);

}
