// Arduino Dice Roller
// Copyright (C) 2020, Uri Shaked

/* gac:start
   ✅ Define pin numbers as constants at the beginning of the program.
*/
#define BUTTON_PIN A0

const byte die1Pins[] = { 2, 3, 4, 5, 6, 7, 8};
const byte die2Pins[] = { 9, 10, 11, 12, A3, A4, A5};
/* gac:end */

void setup() {
  pinMode(A0, INPUT_PULLUP);
  for (byte i = 0; i < 7; i++) {
    pinMode(die1Pins[i], OUTPUT);
    pinMode(die2Pins[i], OUTPUT);
  }
}

/* gac:start
  ✅ Defining this logic in a function lets us reuse the same code for both dice.

  The `pins` parameter receives an array of pin numbers, making this function much
  more generic - it isn't tied to specific set of pins.

  The code here takes advantage of the some specific properties of the dice pip patterns.
  For instance, the center LED will always be on for odd numbers (this is checked by
  the condition `number % 2 == 1`).

  To learn more, check out [Programming Arduino Dice
  Roller: 44 ⇒ 7 Lines of Code](https://www.youtube.com/watch?v=Un3dDMO_wC8).
*/
void displayNumber(const byte pins[], byte number) {
  digitalWrite(pins[0], number > 1 ? HIGH : LOW); // top-left
  digitalWrite(pins[1], number > 3 ? HIGH : LOW); // top-right
  digitalWrite(pins[2], number == 6 ? HIGH : LOW); // middle-left
  digitalWrite(pins[3], number % 2 == 1 ? HIGH : LOW); // center
  digitalWrite(pins[4], number == 6 ? HIGH : LOW); // middle-right
  digitalWrite(pins[5], number > 3 ? HIGH : LOW); // bottom-left
  digitalWrite(pins[6], number > 1 ? HIGH : LOW); // bottom-right
}
/* gac:end */

bool randomReady = false;

void loop() {
  /* gac:
     ✅ Give `digitalRead(...)` a meaningful name by storing the result
     it into a variable */
  bool buttonPressed = digitalRead(BUTTON_PIN) == LOW;
  if (!randomReady && buttonPressed) {
    // Use the time until the first button press
    // to initialize the random number generator
    /* gac:
       In arduino, the `random()` function will return the sequence
       of numbers every time you start your program, unless you call
       `randomSeed()` with a different value each time. To learn more about
       this trick, check out the ["Making random() more Random"
       video](https://www.youtube.com/watch?v=FwnXqZB2eo8).
    */
    randomSeed(micros());
    randomReady = true;
  }

  if (buttonPressed) {
    for (byte i = 0; i < 10; i++) {
      int num1 = random(1, 7);
      int num2 = random(1, 7);
      displayNumber(die1Pins, num1);
      displayNumber(die2Pins, num2);
      delay(50 + i * 20);
    }
  }
}
