# p5-arduino

p5.js sketches that talk to an Arduino over the Web Serial API.

## Structure

- `readSensor/` — the simplest starting point: shows one sensor's value as text on the canvas.
- `readSensorRopes/` — `readSensor` with ropes: 50 hanging ropes that are waviest at a sensor value of 0 and still at 1100 and above.
- `sensorNote/` — plays one constant musical note, and a single sensor changes its pitch.
- `simpleKnock/` — a shorter version of `knock_knock` that does everything in `draw()`.
- `knock_knock/` — plays a sound when a single sensor goes above a threshold.
- `twoSensors/` — plays a different sound for each of two sensors.

Every sketch loads the `ArduinoSerial` class from the [share_resources](https://github.com/peteRogers/share_resources) repo, so there is one copy of it to maintain. It connects a p5.js sketch to an Arduino (or any serial device) over Web Serial.

## Using `ArduinoSerial` in a new sketch

1. Load the hosted file before your sketch script:

   ```html
   <script src="https://peterogers.github.io/share_resources/arduinoSerial.js"></script>
   <script src="sketch.js"></script>
   ```

2. In your sketch, create an instance and handle incoming lines:

   ```js
   const arduino = new ArduinoSerial({ baudRate: 115200 });
   arduino.onLine = (line) => {
     console.log("from Arduino:", line);
   };

   function setup() {
     createCanvas(windowWidth, windowHeight);
   }
   ```

3. Open the page over `http://localhost` or `https://` (Web Serial doesn't work over `file://`). A "Connect to Arduino" button appears automatically in the top-left corner — click it and pick the board's port. Reload later and it reconnects automatically if the same port was previously authorized.

## Sending data from the Arduino

For one sensor, print one number per line and read it with `arduino.value` or `arduino.onValue`:

```cpp
void setup() {
  Serial.begin(115200); // must match baudRate in the sketch
}

void loop() {
  Serial.println(analogRead(A0));
  delay(16);
}
```

For several sensors, print comma-separated numbers on one line, such as `512,300`, and end the line with `println`:

```cpp
void loop() {
  Serial.print(analogRead(A0));
  Serial.print(",");
  Serial.println(analogRead(A1));
  delay(16);
}
```

Then read them with `arduino.values` or `arduino.onValues`:

```js
arduino.onValues = (values) => {
  const [sensor0, sensor1] = values;
};
```

`arduino.value` and `arduino.onValue` keep working on these lines and use the first number. A line where any part isn't a number is skipped, so `value` and `values` keep their last good reading.

To label each reading with an id instead, print `id,value` on one line, such as `3,128` for sensor 3. This suits sensors that report at different times, because each line only carries one reading:

```cpp
void loop() {
  Serial.print(3); // the id
  Serial.print(",");
  Serial.println(analogRead(A0));
  delay(16);
}
```

Then read them with `arduino.sensors` or `arduino.onSensor`:

```js
arduino.onSensor = (id, value) => {
  if (id === 3) console.log("sensor 3:", value);
};
```

The two formats look identical on the serial line, so `3,128` also sets `arduino.values` to `[3, 128]` and `arduino.value` to `3`. Use one style or the other in a sketch, not both.

Close the Arduino IDE's Serial Monitor before connecting from the browser, because only one program can use the port at a time.

## Playing sounds

Both sketches load `p5.sound` and play sounds when a sensor crosses a threshold. Browsers block audio until the user interacts with the page, so click once after the page loads. If the Arduino reconnects automatically, there is no click on the Connect button to unlock it.

### Options

```js
new ArduinoSerial({
  baudRate: 115200,          // must match Serial.begin() on the Arduino
  autoConnect: true,         // auto-reconnect to a previously authorized port on load
  buttonLabel: "Connect to Arduino", // text on the auto-created connect button
});
```

### API

- `arduino.onLine(line)` — called with each newline-terminated line of text received from the board.
- `arduino.onValue(value)` — optional, called with the numeric value whenever a received line parses as a number (e.g. an Arduino printing `analogRead(A0)`). On a comma-separated line it gets the first number.
- `arduino.value` — the last number received, or `null` if none has yet. On a comma-separated line this is the first number. Handy to just read in `draw()` instead of using `onValue`.
- `arduino.onValues(values)` — optional, called with an array of numbers whenever a received line parses as comma-separated numbers (e.g. `[512, 300]`).
- `arduino.values` — the numbers from the last line that parsed, or `[]` if none has yet.
- `arduino.onSensor(id, value)` — optional, called whenever a received line is two numbers and the first is a whole number 0 or above (e.g. `3,128` gives `id` 3 and `value` 128).
- `arduino.sensors` — the latest value for each id, such as `arduino.sensors[3]`, or `undefined` for an id that hasn't arrived yet.
- `arduino.onStatusChange(status)` — optional, called when `status` changes (`"disconnected"`, `"connecting"`, `"connected"`).
- `arduino.onError(error)` — optional, defaults to `console.error`.
- `arduino.status` / `arduino.isConnected` — current connection state.
- `arduino.send(text)` — write a string to the board.
- `arduino.connect()` / `arduino.disconnect()` — manually trigger connect/disconnect (the built-in button already calls `connect()`).

### Browser support

Web Serial is only available in Chromium-based browsers (Chrome, Edge, Opera), not Safari or Firefox.
