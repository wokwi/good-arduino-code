/**
   Arduino Digital Alarm Clock

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.

   Clock Configuration File.
*/

#ifndef __CONFIG_H__
#define __CONFIG_H__

/**
   Change to 0 for running without an external RTC (Real time clock)
*/
#define USE_RTC 1

/**
   Your 7-Segment display type: COMMON_ANODE or COMMON_CATHODE
*/
#define DISPLAY_TYPE COMMON_ANODE

/**
   For how long should we show the alarm status (on/off)?
*/
const int ALARM_STATUS_DISPLAY_TIME = 1000; /* ms */

/**
   For how long should we show the alarm hour?
*/
const int ALARM_HOUR_DISPLAY_TIME = 2500; /* ms */

/**
   For how long should we display the snooze screen?
*/
const int SNOOZE_DISPLAY_TIME = 500; /* ms */

/**
   How many minutes to snooze the alarm for?
*/
const int SNOOZE_TIME = 9; /* minutes */

/**
   The default Alarm hour (for non-RTC mode)
*/
const int DEFAULT_ALARM_HOUR = 9;

#endif /* __CONFIG_H__ */
