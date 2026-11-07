#include <Adafruit_GFX.h>
#include <Adafruit_NeoMatrix.h>
#include <Adafruit_NeoPixel.h>


int PIN = 6;

Adafruit_NeoMatrix matrix = Adafruit_NeoMatrix(8, 8, PIN, NEO_MATRIX_TOP + NEO_MATRIX_RIGHT + NEO_MATRIX_COLUMNS + NEO_MATRIX_PROGRESSIVE, NEO_GRB + NEO_KHZ800);

void setup() {
  matrix.begin();
  matrix.setBrightness(50);
  matrix.setRotation(1);
}



void loop() {
  matrix.clear();
  matrix.drawPixel(0,0, matrix.Color(255,0,0)); //red pixel top left
 
  matrix.show();
  
}








//////////////////////
//BELOW ARE EXTRA FUNCTIONS YOU CAN IGNORE
/////////////



// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Spectrum(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return matrix.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return matrix.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return matrix.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}
