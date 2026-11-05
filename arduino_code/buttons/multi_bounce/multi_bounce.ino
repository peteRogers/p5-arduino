#include <Bounce2.h>

// ADD A PIN HERE FOR EACH NEW BUTTON
const byte buttonPins[] = {7, 6};
const byte numButtons = sizeof(buttonPins) / sizeof(buttonPins[0]);

Bounce buttons[numButtons];

void setup() {
  for (byte i = 0; i < numButtons; i++) {
    buttons[i].attach(buttonPins[i], INPUT_PULLUP);
    buttons[i].interval(5);
  }
  Serial.begin(115200);
}//end setup

void loop() {
  for (byte i = 0; i < numButtons; i++) {
    // Update the Bounce instance (YOU MUST DO THIS EVERY LOOP)
    buttons[i].update();

    // changed() RETURNS true ONCE WHEN THE BUTTON IS PRESSED OR RELEASED
    // WITH INPUT_PULLUP, fell() MEANS PRESSED (1) AND rose() MEANS RELEASED (0)
    if (buttons[i].changed()) {
      Serial.print(i);
      Serial.print(",");
      Serial.println(buttons[i].fell());
    }
  }
}//end loop
