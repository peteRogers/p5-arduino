#include <Wire.h>
#include <Adafruit_GFX.h>
#include "Adafruit_LEDBackpack.h"

Adafruit_BicolorMatrix matrix;

const char* msg = "Hello";

// Send what's been drawn to the display, hold it, then clear for the next frame




void drawSmiley() {
  matrix.clear();
  matrix.drawRoundRect(0, 0, 8, 8, 3,LED_GREEN);
  matrix.drawPixel(2, 2, LED_GREEN);
  matrix.drawPixel(5, 2, LED_GREEN);
  matrix.drawPixel(2, 4, LED_GREEN);
  matrix.drawPixel(5, 4, LED_GREEN);
  matrix.drawLine(3, 5, 4, 5, LED_GREEN);
  matrix.writeDisplay();
}

void drawSad() {
  matrix.clear();
  matrix.drawRoundRect(0, 0, 8, 8, 3, LED_RED);
  matrix.drawPixel(2, 2, LED_RED);
  matrix.drawPixel(5, 2, LED_RED);
  matrix.drawLine(3, 4, 4, 4, LED_RED);
  matrix.drawPixel(2, 5, LED_RED);
  matrix.drawPixel(5, 5, LED_RED);
  matrix.writeDisplay();
}



void setup() {
  matrix.begin(0x70);        // default I2C address
  matrix.setBrightness(8);   // 0-15
  matrix.setRotation(0);     // 0-3, change if it appears sideways
  matrix.setTextWrap(false); // needed for smooth scrolling
  matrix.setTextColor(LED_YELLOW);
}

void loop() {
  drawSmiley();
  delay(1000);

  drawSad();
  delay(1000);
}
