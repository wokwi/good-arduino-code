/**
   Arduino Digital Alarm Clock

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.

*/

/* gac: The SevSeg library controls the clock's 7-Segment Display. */
#include <SevSeg.h>
#include "Button.h"
/* gac:start
   ✅ Split the code into multiple modules

   Instead of keeping all the code in one big file, we split into
   into multiple files. Each file takes care of a different aspect
   of the code:

     [config.h](#source-config_h) global configuration options that
     are affect the entire application.
     [Clock.h](#source-clock_h) keeps track of the current time and
     and alarm setting. It also manages the external RTC (Real time
     clock) chip.
     [AlarmTone.h](#source-alarmtone_h) plays the alarm tone.
*/
#include "config.h"
#include "AlarmTone.h"
#include "Clock.h"
/* gac:end */

/* gac:start
   ✅ Define pin numbers and hardware configuration as constants, at
   the beginning of the program.
*/
const int COLON_PIN = 13;
const int SPEAKER_PIN = A3;

Button hourButton(A0);
Button minuteButton(A1);
Button alarmButton(A2);
/* gac:end */

AlarmTone alarmTone;
Clock clock;
SevSeg sevseg;

/* gac:start
   ✅ Keep track of application state in one central place.

   Our application has 5 different states, as defined here:

   1. `DisplayClock` - Displaying the current time
   2. `DisplayAlarmStatus` - Displaying the alarm status ("on" or "off")
   3. `DisplayAlarmTime` - Setting the alarm time
   4. `DisplayAlarmActive` - Alarm went off
   5. `DisplaySnooze` - Dislaying a "snoozing alarm" animation

   We also define a `lastStateChange` variable to keep track of the time
   in each state. This is useful for states like `DisplayAlarmStatus`,
   which should appear only for a few seconds.
*/
enum DisplayState {
  DisplayClock,
  DisplayAlarmStatus,
  DisplayAlarmTime,
  DisplayAlarmActive,
  DisplaySnooze,
};

DisplayState displayState = DisplayClock;
long lastStateChange = 0;
/* gac:end */

void changeDisplayState(DisplayState newValue) {
  displayState = newValue;
  lastStateChange = millis();
}

long millisSinceStateChange() {
  return millis() - lastStateChange;
}

/* gac:start
   ✅ Short function with a meaningful name

   There are many cases where writing `LOW` actually turns an LED
   on, like here. This can be counterintuitive, but is dictated
   by the hardware.

   By putting the `digitalWrite()` call inside a function, we make
   it very clear what it does: `setColon(true)` will turn the colon
   on, and `setColon(false)` will turn it off.
*/
void setColon(bool on) {
  digitalWrite(COLON_PIN, on ? LOW : HIGH);
}
/* gac:end */

void displayTime() {
  DateTime now = clock.now();
  sevseg.setNumber(now.hour() * 100 + now.minute());
  /* gac: ✅ Use variable name to explain the meaning of the calculation */
  bool blinkState = now.second() % 2 == 0;
  setColon(blinkState);
}

void clockState() {
  displayTime();

  if (alarmButton.read() == Button::RELEASED && clock.alarmActive()) {
    // Read alarmButton has_changed() to clear its state
    alarmButton.has_changed();
    changeDisplayState(DisplayAlarmActive);
    return;
  }

  /* gac:start
     ✅ Meaningful names make the code much more readable.

     Note how easy to understand this code is. It's almost
     equivalent to how you'd describe it in English:

     > "If the hour button is pressed then increment the
     hour on the clock."

     Neat, huh?
  */
  if (hourButton.pressed()) {
    clock.incrementHour();
  }
  /* gac:end */
  if (minuteButton.pressed()) {
    clock.incrementMinute();
  }
  if (alarmButton.pressed()) {
    clock.toggleAlarm();
    changeDisplayState(DisplayAlarmStatus);
  }
}

void alarmStatusState() {
  setColon(false);
  sevseg.setChars(clock.alarmEnabled() ? " on" : " off");
  if (millisSinceStateChange() > ALARM_STATUS_DISPLAY_TIME) {
    changeDisplayState(clock.alarmEnabled() ? DisplayAlarmTime
                       : DisplayClock);
    return;
  }
}

void alarmTimeState() {
  DateTime alarm = clock.alarmTime();
  sevseg.setNumber(alarm.hour() * 100 + alarm.minute(), -1);

  if (millisSinceStateChange() > ALARM_HOUR_DISPLAY_TIME
      || alarmButton.pressed()) {
    changeDisplayState(DisplayClock);
    return;
  }

  if (hourButton.pressed()) {
    clock.incrementAlarmHour();
    lastStateChange = millis();
  }
  if (minuteButton.pressed()) {
    clock.incrementAlarmMinute();
    lastStateChange = millis();
  }
  if (alarmButton.pressed()) {
    changeDisplayState(DisplayClock);
  }
}

void alarmState() {
  displayTime();

  if (alarmButton.read() == Button::RELEASED) {
    alarmTone.play();
  }
  if (alarmButton.pressed()) {
    alarmTone.stop();
  }
  if (alarmButton.released()) {
    alarmTone.stop();
    bool longPress = alarmButton.repeat_count() > 0;
    if (longPress) {
      clock.stopAlarm();
      changeDisplayState(DisplayClock);
    } else {
      clock.snooze();
      changeDisplayState(DisplaySnooze);
    }
  }
}

void snoozeState() {
  sevseg.setChars("****");
  if (millisSinceStateChange() > SNOOZE_DISPLAY_TIME) {
    changeDisplayState(DisplayClock);
    return;
  }
}

/* gac:
   ✅ Move long setup() code into a separate function.

   This helps to keep our `setup()` function short and easy to follow.
   In addition, it makes it clear that all the code below is related
   to the 7 Segment display.
*/
void setupSevenSegment() {
  byte digits = 4;
  byte digitPins[] = {2, 3, 4, 5};
  byte segmentPins[] = {6, 7, 8, 9, 10, 11, 12};
  bool resistorsOnSegments = false;
  bool updateWithDelays = false;
  bool leadingZeros = true;
  bool disableDecPoint = true;
  /* gac:start
     ✅ Use variables when calling a function with many arguments.

     This makes it easier to understand what each argument does. Compare with:

     ```
     sevsev.begin(DISPLAY_TYPE, 4, digitPins, segmentPins, false, false, true,
                  true);
     ```

     Without using variables for the arguments, you'd have to open the SevSeg
     documentation to understand what all if these `false` and `true` mean.

     You may wonder where `DISPLAY_TYPE` comes from: it is defined in
     [config.h](#source-config_h).
  */
  sevseg.begin(DISPLAY_TYPE, digits, digitPins, segmentPins, resistorsOnSegments,
               updateWithDelays, leadingZeros, disableDecPoint);
  /* gac:end */
  sevseg.setBrightness(90);

  pinMode(COLON_PIN, OUTPUT);
}

void setup() {
  Serial.begin(115200);

  clock.begin();

  hourButton.begin();
  hourButton.set_repeat(500, 200);

  minuteButton.begin();
  minuteButton.set_repeat(500, 200);

  alarmButton.begin();
  alarmButton.set_repeat(1000, -1);

  alarmTone.begin(SPEAKER_PIN);

  setupSevenSegment();
}

void loop() {
  /* gac:
     We need to update the 7-segment display very frequently, otherwise
     the user will see gibberish. For this reason, we avoid using `delay()`
     in our code. This ensures that `loop()` is tight - it executes fast
     and often.
  */
  sevseg.refreshDisplay();

  /* gac:
     ✅ Keep loop() short.

     We created one function for each clock state, so all that `loop()` has
     to do is just call the appropriate function.
  */
  switch (displayState) {
    case DisplayClock:
      clockState();
      break;

    case DisplayAlarmStatus:
      alarmStatusState();
      break;

    case DisplayAlarmTime:
      alarmTimeState();
      break;

    case DisplayAlarmActive:
      alarmState();
      break;

    case DisplaySnooze:
      snoozeState();
      break;
  }
}
