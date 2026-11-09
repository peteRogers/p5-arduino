
#include <Wire.h>
#include "Adafruit_MPR121.h"
#include <I2CRecovery.h>

Adafruit_MPR121 cap = Adafruit_MPR121();

uint16_t lasttouched = 0;
uint16_t currtouched = 0;

// cap.begin() starts Wire and soft-resets the MPR121 itself, so the only thing
// to do first is free the bus in case a reset left the chip holding it.
// Autoconfig (the last argument) must be on: with it off, the library leaves
// auto-reconfigure running with limits of 0, which drops the charge current
// to 1uA, so readings stay near zero and no touch is ever detected.
bool startTouch() {
  Wire.end();
  i2cRecoverBus(Wire);  // must match the bus the MPR121 is on (Wire = A4/A5)
  return cap.begin(0x5A, &Wire, 12, 6, true);
}

void setup() {
  //while (!Serial);
  Serial.begin(115200);
  Serial.println("Adafruit MPR121 Capacitive Touch sensor test");
  while (!startTouch()) {
    Serial.println("MPR121 not found, check wiring? Retrying...");
    delay(500);
  }

}

void loop() {
  // Get the currently touched pads

  currtouched = cap.touched();
  for (uint8_t i=0; i<12; i++) {
    if ((currtouched & bit(i)) && !(lasttouched & bit(i)) ) {
     
      Serial.print(i); 
      Serial.print(","); 
      Serial.println("1");
      delay(1);
    }
    if (!(currtouched & bit(i)) && (lasttouched & bit(i)) ) {
      
      Serial.print(i); 
      Serial.print(","); 
      Serial.println("0");
      delay(1);
    }
  }
  lasttouched = currtouched;
  
}
