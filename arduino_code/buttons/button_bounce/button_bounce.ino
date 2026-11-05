#include <Bounce2.h>

// Create A Bounce OBJECT
Bounce bounce1;

void setup() {
  bounce1.attach(7, INPUT_PULLUP);
  bounce1.interval(5);
  Serial.begin(115200);
}//end setup

void loop() {
  // Update the Bounce instance (YOU MUST DO THIS EVERY LOOP)
  bounce1.update();

  // <Bounce>.fell() RETURNS true ONCE WHEN THE INPUT GOES FROM HIGH TO LOW
  // WITH INPUT_PULLUP, THAT IS THE MOMENT THE BUTTON IS PRESSED
  if (bounce1.fell()) {
    Serial.println("1");
  }

  if (bounce1.rose()) {
    Serial.println("0");
  }
}//end loop

