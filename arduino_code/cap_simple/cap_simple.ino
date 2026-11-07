#include <Wire.h>
#include "Adafruit_MPR121.h"
#include <I2CRecovery.h>

// Watches a single pad on the MPR121 and sends 1 when it is touched,
// 0 when it is released.

const uint8_t PAD = 0;  // which pad to watch (0-11)

Adafruit_MPR121 cap = Adafruit_MPR121();

bool wasTouched = false;

// cap.begin() starts Wire and soft-resets the MPR121 itself, so the only thing
// to do first is free the bus in case a reset left the chip holding it.
// Autoconfig (the last argument) must be on: with it off, readings stay near
// zero and no touch is ever detected.
bool startTouch() {
  Wire.end();
  i2cRecoverBus(Wire);  // must match the bus the MPR121 is on (Wire = A4/A5)
  return cap.begin(0x5A, &Wire, 12, 6, true);
}

void setup() {
  Serial.begin(115200);
  while (!startTouch()) {
    Serial.println("MPR121 not found, check wiring? Retrying...");
    delay(500);
  }
}

void loop() {
  bool isTouched = cap.touched() & bit(PAD);

  if (isTouched != wasTouched) {
    Serial.println(isTouched ? 1 : 0);
    wasTouched = isTouched;
  }

  delay(10);
}
