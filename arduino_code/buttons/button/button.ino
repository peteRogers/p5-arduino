// NO DEBOUNCING: ONE PRESS WILL SOMETIMES PRINT "pressed" MORE THAN ONCE
// COMPARE WITH button_bounce, WHICH FIXES THIS USING THE Bounce2 LIBRARY

const int BUTTON_PIN = 7;

// THE BUTTON STATE FROM THE PREVIOUS loop() (HIGH = NOT PRESSED WITH INPUT_PULLUP)
bool lastButtonState = HIGH;

void setup() {
  pinMode(BUTTON_PIN, INPUT_PULLUP); // USE INTERNAL PULL-UP
  Serial.begin(115200);
}

void loop() {
  bool buttonState = digitalRead(BUTTON_PIN);

  // WITH INPUT_PULLUP, HIGH TO LOW MEANS THE BUTTON HAS JUST BEEN PRESSED
  // A BOUNCING BUTTON DOES THIS SEVERAL TIMES IN ONE PRESS
  if (buttonState == LOW && lastButtonState == HIGH) {
    Serial.println("pressed");
  }

  lastButtonState = buttonState; // REMEMBER THIS READING FOR THE NEXT loop()
}
