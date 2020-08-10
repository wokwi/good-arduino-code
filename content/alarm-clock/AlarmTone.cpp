/**
   Arduino Digital Alarm Clock

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.

*/

#include <Arduino.h>
#include "AlarmTone.h"

#define TONE_TIME 500 /* ms */
#define TONE_SPACING 100 /* ms */

/* gac:start
   You can customize the alarm sound by changing the numbers in the array.
   The numbers represent sound frequencies (in hertz), and is passed to
   Arduino's `tone()` function.
*/
static const uint16_t TONES[] = {
  500,
  800,
};
/* gac:end */
const uint16_t NUM_TONES = sizeof(TONES) / sizeof(TONES[0]);

AlarmTone::AlarmTone()
  : _playing(false)
  , _tone_index(0)
  , _last_tone_time(0) {
}

void AlarmTone::begin(uint8_t pin) {
  _pin = pin;
  pinMode(_pin, OUTPUT);
}

void AlarmTone::play() {
  if (!_playing || _last_tone_time + TONE_TIME + TONE_SPACING < millis()) {
    tone(_pin, TONES[_tone_index], TONE_TIME);
    _tone_index = (_tone_index + 1) % NUM_TONES;
    _last_tone_time = millis();
  }
  _playing = true;
}

void AlarmTone::stop() {
  noTone(_pin);
  _tone_index = 0;
  _playing = false;
}
