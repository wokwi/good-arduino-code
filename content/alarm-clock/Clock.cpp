/**
   Arduino Digital Alarm Clock

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.

*/

#include <Arduino.h>
#include "Clock.h"

/* gac:start
   ✅ Define constants instead of using "magic numbers".

   It is much easier to understand `MINUTE` than figuring
   out what 60000 is.

   The `L` at the end tells the compiler we want a long
   integer. Otherwise, the number is treated as `int`, and
   since this number is out of the range for `int`
   (-32,768 ... 32,767), we'll get an unexpected result:
   -5536 instead of 60000.
*/
#define MINUTE 60 * 1000L /* ms */
#define TIMESPAN_DAY TimeSpan(1, 0, 0, 0)
/* gac:end */

/* gac:start
   The NVRAM is small region of memory on the RTC chip. It
   lets us store values that will remain even when the power
   goes off.

   We use the NVRAM to store the alarm state, hour and minute.
   These constants define where we store these values inside
   the NVRAM.
*/
#define NVRAM_ADDR_ALARM_ENABLED 0
#define NVRAM_ADDR_ALARM_HOUR    1
#define NVRAM_ADDR_ALARM_MINUTE  2
/* gac:end */

Clock::Clock()
  : _alarm_state(ALARM_OFF)
  , _alarm_snooze_time(0)
  , _alarm_hour(DEFAULT_ALARM_HOUR)
  , _alarm_minute(0) {
}

void Clock::begin() {
  /* gac:
     This code compiles differently, accoding to the USE_RTC
     constant defined in config.h.

     If we have an RTC chip, we'll read the time and alarm
     configuration for the RTC. Otherwise, we'll just initialize
     the current time to zero, and the alarm hour to the default
     as defined in config.h.
  */
# if USE_RTC
  if (!_rtc.begin()) {
    Serial.println("Couldn't find RTC");
    abort();
  }
  _alarm_state = _rtc.readnvram(NVRAM_ADDR_ALARM_ENABLED) ? ALARM_OFF : ALARM_DISABLED;
  _alarm_hour = _rtc.readnvram(NVRAM_ADDR_ALARM_HOUR) % 24;
  _alarm_minute = _rtc.readnvram(NVRAM_ADDR_ALARM_MINUTE) % 60;
# else /* USE_RTC */
  DateTime zeroTime;
  _rtc.begin(zeroTime);
# endif
}

/***** Clock management *****/

DateTime Clock::now() {
  return _rtc.now();
}

void Clock::incrementMinute() {
  DateTime now = _rtc.now();
  DateTime newTime = DateTime(now.year(), now.month(), now.day(), now.hour(),
                              (now.minute() + 1) % 60);
  _rtc.adjust(newTime);
}

void Clock::incrementHour() {
  DateTime now = _rtc.now();
  DateTime newTime = DateTime(now.year(), now.month(), now.day(),
                              (now.hour() + 1) % 24, now.minute());
  _rtc.adjust(newTime);
}

/***** Alarm management *****/
bool Clock::_isAlarmDueTime() {
  auto currentTime = now();
  auto alarm = alarmTime();
  return ((currentTime.hour() == alarm.hour())
          && (currentTime.minute() == alarm.minute()));
}

bool Clock::alarmEnabled() {
  return _alarm_state != ALARM_DISABLED;
}

bool Clock::alarmActive() {
  switch (_alarm_state) {
    case ALARM_DISABLED:
      return false;

    case ALARM_OFF:
      if (_isAlarmDueTime()) {
        _alarm_state = ALARM_ACTIVE;
        return true;
      }
      return false;

    case ALARM_ACTIVE:
      return true;

    case ALARM_SNOOZED:
      if (millis() >= _alarm_snooze_time) {
        _alarm_state = ALARM_ACTIVE;
        return true;
      }
      return false;

    case ALARM_STOPPED:
      if (!_isAlarmDueTime()) {
        _alarm_state = ALARM_OFF;
      }
      return false;

    default:
      return false;
  }
}


void Clock::toggleAlarm() {
  bool enabled = !alarmEnabled();
  _alarm_state = enabled ? ALARM_OFF : ALARM_DISABLED;
  _rtc.writenvram(NVRAM_ADDR_ALARM_ENABLED, enabled);
}

DateTime Clock::alarmTime() {
  DateTime now = _rtc.now();
  DateTime alarm = DateTime(now.year(), now.month(), now.day(), _alarm_hour, _alarm_minute);
  return alarm >= now ? alarm : alarm + TIMESPAN_DAY;
}

void Clock::snooze() {
  _alarm_state = ALARM_SNOOZED;
  _alarm_snooze_time = millis() + SNOOZE_TIME * MINUTE;
}

void Clock::stopAlarm() {
  _alarm_state = ALARM_STOPPED;
}

void Clock::incrementAlarmHour() {
  _alarm_hour = (_alarm_hour + 1) % 24;
  _alarm_state = ALARM_OFF;
  _rtc.writenvram(NVRAM_ADDR_ALARM_HOUR, _alarm_hour);
}

void Clock::incrementAlarmMinute() {
  _alarm_minute = (_alarm_minute + 1) % 60;
  _alarm_state = ALARM_OFF;
  _rtc.writenvram(NVRAM_ADDR_ALARM_MINUTE, _alarm_minute);
}
