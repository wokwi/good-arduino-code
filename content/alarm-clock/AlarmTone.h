/**
   Arduino Digital Alarm Clock

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.

*/

#ifndef __ALARM_TONE_H__
#define __ALARM_TONE_H__

class AlarmTone {
  public:
    AlarmTone();
    void begin(uint8_t pin);
    void play();
    void stop();

  private:
    uint8_t _pin;
    bool _playing;
    uint8_t _tone_index;
    unsigned long _last_tone_time;
};

#endif /* __ALARM_TONE_H */
