/**
   Simon Game for Arduino

   Copyright (C) 2016, Uri Shaked

   Licensed under the MIT License.
*/

#include "pitches.h"

/* Constants - define pin numbers for leds, buttons and speaker, and also the game tones */
char ledPins[] = {9, 10, 11, 12};
char buttonPins[] = {2, 3, 4, 5};
#define SPEAKER_PIN 8

#define MAX_GAME_LENGTH 100

int gameTones[] = { NOTE_G3, NOTE_C4, NOTE_E4, NOTE_G5};

/* Global variales - store the game state */
byte gameSequence[MAX_GAME_LENGTH] = {0};
byte gameIndex = 0;

/**
   Set up the Arduino board and initialize Serial communication
*/
void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  pinMode(SPEAKER_PIN, OUTPUT);
  // The following line primes the random number generator. It assumes pin A0 is floating (disconnected)
  randomSeed(analogRead(A0));
}

/**
   Lights the given led and plays the suitable tone
*/
void lightLedAndPlaySound(byte ledIndex) {
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
    char currentLed = gameSequence[i];
    lightLedAndPlaySound(currentLed);
    delay(50);
  }
}

/**
    Waits until the user pressed one of the buttons, and returns the index of that button
*/
byte readButton() {
  for (;;) {
    for (int i = 0; i < 4; i++) {
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
  // Play a Wah-Wah-Wah-Wah sound
  tone(SPEAKER_PIN, NOTE_DS5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_D5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_CS5);
  delay(300);
  for (int i = 0; i < 200; i++) {
    tone(SPEAKER_PIN, NOTE_C5 + (i % 20 - 10));
    delay(5);
  }
  noTone(SPEAKER_PIN);
  delay(500);
}

/**
   Get the user input and compare it with the expected sequence. If the user fails, play the game over sequence and restart the game.
*/
void checkUserSequence() {
  for (int i = 0; i < gameIndex; i++) {
    char expectedButton = gameSequence[i];
    char actualButton = readButton();
    lightLedAndPlaySound(actualButton);
    if (expectedButton == actualButton) {
      /* good */
    } else {
      gameOver();
      return;
    }
  }
}

/**
   Plays an hooray sound whenever the user finishes a level
*/
void levelUp() {
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

  playSequence();
  checkUserSequence();
  delay(300);

  if (gameIndex > 0) {
    levelUp();
    delay(300);
  }
}
