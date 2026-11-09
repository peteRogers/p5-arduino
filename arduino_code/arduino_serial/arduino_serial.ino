// Reads analog pin A0 and sends the value (0-1023) over serial at 115200 baud.

const int sensorPin = A0;

void setup() {
  Serial.begin(115200);
}

void loop() {
  int value = analogRead(sensorPin);
  Serial.println(value);
  delay(10);  // ~100 readings per second
}
