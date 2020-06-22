// Arduino Dice Roller
// Copyright (C) 2020, Uri Shaked

#define BUTTON_PIN A0

const byte die1Pins[] = { 2, 3, 4, 5, 6, 7, 8};
const byte die2Pins[] = { 9, 10, 11, 12, A3, A4, A5};

void setup() {
  pinMode(A0, INPUT_PULLUP);
  for (byte i = 0; i < 7; i++) {
    pinMode(die1Pins[i], OUTPUT);
    pinMode(die2Pins[i], OUTPUT);
  }
}

void displayNumber(const byte pins[], byte number) {
  byte states = pins[0];
  for (byte i = 0; i < 7; i++) {
    digitalWrite(pins[i], LOW);
  }
  switch (number) {
    case 1:
      digitalWrite(pins[3], HIGH);
      break;
    case 2:
      digitalWrite(pins[0], HIGH);
      digitalWrite(pins[6], HIGH);
      break;
    case 3:
      digitalWrite(pins[0], HIGH);
      digitalWrite(pins[3], HIGH);
      digitalWrite(pins[6], HIGH);
      break;
    case 4:
      digitalWrite(pins[0], HIGH);
      digitalWrite(pins[1], HIGH);
      digitalWrite(pins[5], HIGH);
      digitalWrite(pins[6], HIGH);
      break;
    case 5:
      digitalWrite(pins[0], HIGH);
      digitalWrite(pins[1], HIGH);
      digitalWrite(pins[3], HIGH);
      digitalWrite(pins[5], HIGH);
      digitalWrite(pins[6], HIGH);
      break;
    case 6:
      digitalWrite(pins[0], HIGH);
      digitalWrite(pins[1], HIGH);
      digitalWrite(pins[2], HIGH);
      digitalWrite(pins[4], HIGH);
      digitalWrite(pins[5], HIGH);
      digitalWrite(pins[6], HIGH);
      break;
  }
}

bool randomReady = false;

void loop() {
  bool buttonPressed = !digitalRead(BUTTON_PIN);
  if (!randomReady && buttonPressed) {
    // Use the time until the first button press
    // to initialize the random number generator
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
