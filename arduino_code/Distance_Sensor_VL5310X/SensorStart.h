#ifndef SENSOR_START_H
#define SENSOR_START_H

#include <Wire.h>
#include <VL53L0X.h>
#include <I2CRecovery.h>

// Resetting the Arduino doesn't reset the sensor - it stays powered and keeps
// whatever state it was in. If the reset landed partway through a reading it
// can be left on the wrong register page, and init() then fails on every reset
// until the power is removed. This puts it back to its power-on state.
inline void resetSensor(VL53L0X &sensor) {
  sensor.writeReg(0xFF, 0x00);  // back to the normal register page
  sensor.writeReg(0x80, 0x00);
  sensor.writeReg(VL53L0X::SOFT_RESET_GO2_SOFT_RESET_N, 0x00);  // enter reset
  delay(5);
  sensor.writeReg(VL53L0X::SOFT_RESET_GO2_SOFT_RESET_N, 0x01);  // leave reset
  delay(5);
}

inline bool startSensor(VL53L0X &sensor) {
  Wire.end();
  i2cRecoverBus(Wire);  // must match the bus the sensor is on (Wire = A4/A5)
  Wire.begin();
  resetSensor(sensor);
  sensor.setTimeout(500);
  return sensor.init();
}

#endif
