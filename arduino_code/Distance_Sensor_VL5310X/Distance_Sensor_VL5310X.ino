#include <VL53L0X.h>
#include "SensorStart.h"

VL53L0X distanceSensor;

void setup() {
  Serial.begin(115200);
  while (!startSensor(distanceSensor)) {
    Serial.println("Failed to detect and initialize sensor! Retrying...");
    delay(500);
  }
  Serial.println("sensor started");
}

void loop() {
  // put your main code here, to run repeatedly:
 //int dist =  distanceSensor.readRangeContinuousMillimeters();
  int dist = distanceSensor.readRangeSingleMillimeters();
  Serial.println(dist);
  delay(10);
}
