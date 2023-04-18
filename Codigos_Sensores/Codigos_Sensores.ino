#include <MQ131.h> //https://github.com/ostaquet/Arduino-MQ131-driver / descargar desde el administrador de bibliotecas
#include <SoftwareSerial.h> //https://docs.arduino.cc/learn/built-in-libraries/software-serial / ya viene en arduino
#include <TinyGPS.h>// mirar el link de SoftwareSerial / descargar desde el administrador de bibliotecas
// Necesario para GPS
TinyGPS gps;
SoftwareSerial ss(4,3);

void setup() {
  Serial.begin(115200);
  ss.begin(9600);
  /* Activar el sensor:
   Control de calor en pin x en este caso 2
   Sensor analog read en pin x en este caso A0
   Modo LOW_CONCENTRATION (investigar bien)
   Load resistance RL of 1MOhms (1000000 Ohms)*/
  MQ131.begin(2,A0, LOW_CONCENTRATION, 1000000);  
  
  Serial.println("Calibration in progress...");
  MQ131.calibrate();
  Serial.println("Calibration done!");
}

void loop() {
  //Sensor UV
  float sensorVoltage; 
  float sensorValue;
 
  sensorValue = analogRead(A0); //usar un pin analogico, no necesariamente A0
  sensorVoltage = sensorValue/1024*5.0;          
  Serial.print("sensor reading = ");
  Serial.print(sensorValue); //Ver si el valor esta en la unidad de medida correcta
  Serial.print(", Sensor voltage = ");
  Serial.print(sensorVoltage);
  Serial.println(" V");
  delay(1000);
  
  //Sensor MQ-131
  Serial.println("Sampling..."); 
  MQ131.sample(); //Toma una muestra
  Serial.print("Concentration O3 : ");
  Serial.print(MQ131.getO3(PPM)); //Calcula la muestra en PPM (PArticula Por Millón)
  Serial.println(" ppm");

  //Modulo GPS
  /*if(gps.available())
  {
    dato=gps.read();
    Serial.print(dato);
  }*/
  bool nweData = false;
  unsigned long chars;
  unsigned short sentences, failed;
}
