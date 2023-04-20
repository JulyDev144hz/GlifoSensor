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
 
  sensorValue = analogRead(A1); //usar un pin analogico, no necesariamente A1
  sensorVoltage = sensorValue/1024*5.0;          
  Serial.print("sensor reading = ");
  Serial.print(sensorValue); //Ver si el valor esta en la unidad de medida correcta
  Serial.print(", Sensor voltage = ");
  Serial.print(sensorVoltage);
  Serial.println(" V");
  delay(1000);
  println("");
  
  //Sensor MQ-4
  Serial.print("Gas metano: ");
  Serial.println(analogRead(A2)); //Poner pin analógico donde vaya el sensor MQ-4 no necesariamente A2
  println("");
  
  //Sensor MQ-131
  Serial.println("Sampling..."); 
  MQ131.sample(); //Toma una muestra
  Serial.print("Concentration O3 : ");
  Serial.print(MQ131.getO3(PPM)); //Calcula la muestra en PPM (PArticula Por Millón)
  Serial.println(" ppm");
  println("");
  
  //Modulo GPS              / En caso de tener problemas durante el testing revisar esta página https://www.pjrc.com/teensy/td_libs_TinyGPS.html
  /*if(gps.available())
  {
    dato=gps.read();
    Serial.print(dato);
  }*/
  bool newData = false;
  unsigned long chars;
  unsigned short sentences, failed;
  // For one second we parse GPS data and report some key values
  for (unsigned long start = millis(); millis() - start < 1000;)
  {
    while (ss.available())
    {
      char c = ss.read();
      // Serial.write(c); // uncomment this line if you want to see the GPS data flowing
      if (gps.encode(c)) // Did a new valid sentence come in?
        newData = true;
    }
  }

  if (newData)
  {
    float flat, flon;
    unsigned long age;
    gps.f_get_position(&flat, &flon, &age);
    Serial.print("LAT=");
    Serial.print(flat == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flat, 6); //Muestra la latitud de la locacion del GPS
    Serial.print(" LON=");
    Serial.print(flon == TinyGPS::GPS_INVALID_F_ANGLE ? 0.0 : flon, 6); //Muestra la longitud
    Serial.print(" SAT=");
    Serial.print(gps.satellites() == TinyGPS::GPS_INVALID_SATELLITES ? 0 : gps.satellites());
    Serial.print(" PREC=");
    Serial.print(gps.hdop() == TinyGPS::GPS_INVALID_HDOP ? 0 : gps.hdop());
  }
  
  gps.stats(&chars, &sentences, &failed);
  Serial.print(" CHARS=");
  Serial.print(chars);
  Serial.print(" SENTENCES=");
  Serial.print(sentences);
  Serial.print(" CHECKSUM ERROR=");
  Serial.println(failed);
  if (chars == 0){
    Serial.println("** No characters received from GPS: check wiring **");
  }
  println("");
}
