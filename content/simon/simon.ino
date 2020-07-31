/**
   Simon Game for Arduino

   Copyright (C) 2016, Uri Shaked

   Released under the MIT License.
*/

/* gac: [pitches.h](#source-pitches_h) defines constants for the different music notes.
   For instance, it defines `NOTE_G3` and `NOTE_C4` that we use below, when we initialize
   the `gameTones` array. */
#include "pitches.h"

/* Constants - define pin numbers for LEDs,
   buttons and speaker, and also the game tones: */
/* gac:start
   ✅ Define pin numbers as constants at the beginning of the program
*/
const byte ledPins[] = {9, 10, 11, 12};
const byte buttonPins[] = {2, 3, 4, 5};
#define SPEAKER_PIN 8
/* gac:end */

/* gac:
   ✅ Defining the max game length as a constant makes it clear
   what this "magic" number controls. */
#define MAX_GAME_LENGTH 100

/* gac: The tone for each button is stored in an array,
   so we can easily match each LED, button and their corresponding
   tone by looking at a specific index of the `ledPins`, `buttonPins`,
   and `gameTones` arrays.
*/
const int gameTones[] = { NOTE_G3, NOTE_C4, NOTE_E4, NOTE_G5};

/* Global variables - store the game state */
/* gac:start
   ✅ It's a good practice to initialize all variables to a default value when
   declaring them.

   We use `gameSequence` to keep track of the current color sequence
   that the user has to repeat, and `gameIndex` tells us how long the
   sequence is, so we know how many cells of the array we should look at.
*/
byte gameSequence[MAX_GAME_LENGTH] = {0};
byte gameIndex = 0;
/* gac:end */

/**
   Set up the Arduino board and initialize Serial communication
*/
void setup() {
  Serial.begin(9600);
  /* gac:start
     ✅ Defining the pins for the LEDs and buttons in an array allows
     us to initialize them using a `for` loop, instead of calling
     the `pinMode()` function for each individual button / LED.
  */
  for (byte i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  /* gac:end */
  pinMode(SPEAKER_PIN, OUTPUT);
  // The following line primes the random number generator.
  // It assumes pin A0 is floating (disconnected):
  /* gac: In arduino, the `random()` function will return the sequence
     of numbers every time you start your program, unless you call
     `randomSeed()` with a different value each time. To learn more about
     this trick, check out the ["Making random() more Random"
     video](https://www.youtube.com/watch?v=FwnXqZB2eo8). */
  randomSeed(analogRead(A0));
}

/**
   Lights the given LED and plays a suitable tone
*/
/* gac: ✅ Good function name: describes exactly what it does */
void lightLedAndPlayTone(byte ledIndex) {
  digitalWrite(ledPins[ledIndex], HIGH);
  tone(SPEAKER_PIN, gameTones[ledIndex]);
  delay(300);
  digitalWrite(ledPins[ledIndex], LOW);
  noTone(SPEAKER_PIN);
}

/**
   Plays the current sequence of notes that the user has to repeat
*/
void playSequence() {
  for (int i = 0; i < gameIndex; i++) {
    byte currentLed = gameSequence[i];
    lightLedAndPlayTone(currentLed);
    delay(50);
  }
}

/**
    Waits until the user pressed one of the buttons,
    and returns the index of that button
*/
byte readButtons() {
  /* gac:  The `while` loop will run continuously until one of the buttons is pressed. */
  while (true) {
    for (byte i = 0; i < 4; i++) {
      byte buttonPin = buttonPins[i];
      if (digitalRead(buttonPin) == LOW) {
        return i;
      }
    }
    delay(1);
  }
}

/**
  Play the game over sequence, and report the game score
*/
void gameOver() {
  Serial.print("Game over! your score: ");
  Serial.println(gameIndex - 1);
  gameIndex = 0;
  delay(200);

  /* gac: This comment is essential here. The code below isn't very straightforward,
     and the comment summarizes what it does. It might even be better to move this
     code into a separate function, and call it something like `playGameOverSound()`. */
  // Play a Wah-Wah-Wah-Wah sound
  tone(SPEAKER_PIN, NOTE_DS5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_D5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_CS5);
  delay(300);
  for (byte i = 0; i < 10; i++) {
    /* gac:start
       Makes the tone sound wavy by slightly adjusting the pitch. */
    for (int pitch = -10; pitch <= 10; pitch++) {
      tone(SPEAKER_PIN, NOTE_C5 + pitch);
      delay(5);
      /* gac:end */
    }
  }
  noTone(SPEAKER_PIN);
  delay(500);
}

/**
   Get the user's input and compare it with the expected sequence.
*/
bool checkUserSequence() {
  for (int i = 0; i < gameIndex; i++) {
    byte expectedButton = gameSequence[i];
    byte actualButton = readButtons();
    lightLedAndPlayTone(actualButton);
    if (expectedButton != actualButton) {
      return false;
    }
  }

  return true;
}

/**
   Plays a hooray sound whenever the user finishes a level
*/
void playLevelUpSound() {
  tone(SPEAKER_PIN, NOTE_E4);
  delay(150);
  tone(SPEAKER_PIN, NOTE_G4);
  delay(150);
  tone(SPEAKER_PIN, NOTE_E5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_C5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_D5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_G5);
  delay(150);
  noTone(SPEAKER_PIN);
}

/**
   The main game loop
*/
void loop() {
  // Add a random color to the end of the sequence
  gameSequence[gameIndex] = random(0, 4);
  gameIndex++;
  /* gac:start
     ✅ Array boundary check

     The C++ language does not protect us from accessing data beyond the
     end of the array. Therefore, our code must always check that we are
     still within the array boundaries. Otherwise, we'll get unexpected
     behavior and the program may crash.

     In this case, we make sure that `gameIndex` always stays below
     `MAX_GAME_LENGTH`, which is the size of the `gameSequence` array.
  */
  if (gameIndex >= MAX_GAME_LENGTH) {
    gameIndex = MAX_GAME_LENGTH - 1;
  }
  /* gac:end */

  playSequence();
  if (!checkUserSequence()) {
    gameOver();
  }

  delay(300);

  if (gameIndex > 0) {
    playLevelUpSound();
    delay(300);
  }
}
