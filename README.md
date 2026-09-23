# p5-arduino

p5.js sketches that talk to an Arduino over the Web Serial API.

## Structure

- `shared/arduinoSerial.js` — reusable `ArduinoSerial` class for connecting a p5.js sketch to an Arduino (or any serial device) over Web Serial. Shared across all sketches in this repo.
- `simpleConnection/` — example sketch using `ArduinoSerial`.

## Using `ArduinoSerial` in a new sketch

1. Reference the shared file with a relative path from your sketch folder, before your sketch script:

   ```html
   <script src="../shared/arduinoSerial.js"></script>
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
- `arduino.onValue(value)` — optional, called with the numeric value whenever a received line parses as a number (e.g. an Arduino printing `analogRead(A0)`).
- `arduino.value` — the last line that successfully parsed as a number, or `null` if none has yet. Handy to just read in `draw()` instead of using `onValue`.
- `arduino.onStatusChange(status)` — optional, called when `status` changes (`"disconnected"`, `"connecting"`, `"connected"`).
- `arduino.onError(error)` — optional, defaults to `console.error`.
- `arduino.status` / `arduino.isConnected` — current connection state.
- `arduino.send(text)` — write a string to the board.
- `arduino.connect()` / `arduino.disconnect()` — manually trigger connect/disconnect (the built-in button already calls `connect()`).

### Browser support

Web Serial is only available in Chromium-based browsers (Chrome, Edge, Opera), not Safari or Firefox.
