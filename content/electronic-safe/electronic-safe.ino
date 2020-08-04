/**
   Arduino Electronic Safe

   Copyright (C) 2020, Uri Shaked.
   Released under the MIT License.
*/

/* gac: The LiquidCrystal library lets us control the LCD Display. */
#include <LiquidCrystal.h>
#include <Keypad.h>
#include <Servo.h>
#include "SafeState.h"
#include "icons.h"

/* Locking mechanism definitions */
#define SERVO_PIN 6
#define SERVO_LOCK_POS   20
#define SERVO_UNLOCK_POS 90
Servo lockServo;

/* Display */
/* gac: these numbers (12, 11, ...) are the pins the LCD display
   is connected to.
*/.
LiquidCrystal lcd(12, 11, 10, 9, 8, 7);

/* Keypad setup */
/* gac:start
   ✅ Define pin numbers and hardware configuration as constants, at
   the beginning of the program.

   The Keypad library is very flexible, and therefore requires many
   configuration options: the number of rows / columns, the pins
   numbers for the rows and columns, and the name of each key (defined
   by the `keys` matrix).
*/
const byte KEYPAD_ROWS = 4;
const byte KEYPAD_COLS = 4;
byte rowPins[KEYPAD_ROWS] = {5, 4, 3, 2};
byte colPins[KEYPAD_COLS] = {A3, A2, A1, A0};
char keys[KEYPAD_ROWS][KEYPAD_COLS] = {
  {'1', '2', '3', 'A'},
  {'4', '5', '6', 'B'},
  {'7', '8', '9', 'C'},
  {'*', '0', '#', 'D'}
};
/* gac:end */

Keypad keypad = Keypad(makeKeymap(keys), rowPins, colPins, KEYPAD_ROWS, KEYPAD_COLS);

/* SafeState stores the secret code in EEPROM */
/* gac:
   ✅ Separate logic into different C++ classes.

   `SafeState` is a class that we define in a separate file,
   [SafeState.h](#source-safestate_h). It takes care of
   managing the state of the safe: whether it's currently
   open or locked, and the secret code.
*/
SafeState safeState;

void lock() {
  lockServo.write(SERVO_LOCK_POS);
  safeState.lock();
}

void unlock() {
  lockServo.write(SERVO_UNLOCK_POS);
}

void showStartupMessage() {
  lcd.setCursor(4, 0);
  lcd.print("Welcome!");
  delay(1000);

  lcd.setCursor(0, 2);
  String message = "ArduinoSafe v1.0";
  /* gac:start
     The following loop animates the "ArduinoSafe V1.0"
     message, so it appears character-by-character, instead
     of all at once. If we had multiple messages to animate,
     it'd probably make sense to move this logic into a
     separate function.
  */
  for (byte i = 0; i < message.length(); i++) {
    lcd.print(message[i]);
    delay(100);
  }
  /* gac:end */
  delay(500);
}

/* gac:
   ✅ Short functions with meaningful name.

   This piece of code can be confusing. That's why we moved
   it into a separate function, and the name of the function
   tells you exactly what the code does.
*/
String inputSecretCode() {
  lcd.setCursor(5, 1);
  lcd.print("[____]");
  lcd.setCursor(6, 1);
  String result = "";
  while (result.length() < 4) {
    char key = keypad.getKey();
    /* gac:start
       Only accept numeric digits as valid secret code input.
    */
    if (key >= '0' && key <= '9') {
      lcd.print('*');
      result += key;
    }
    /* gac:end */
  }
  return result;
}

/* gac:
   ✅ Move repetitive code into functions

   The wait screen is displayed in 3 different places:
   when locking the safe, when unlocking it, and when
   entering the wrong code. Instead of repeating the
   code 3 different times, we define the `showWaitScreen()`
   function.
*/
void showWaitScreen(int delayMillis) {
  lcd.setCursor(2, 1);
  lcd.print("[..........]");
  lcd.setCursor(3, 1);
  for (byte i = 0; i < 10; i++) {
    delay(delayMillis);
    lcd.print("=");
  }
}

bool setNewCode() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Enter new code:");
  String newCode = inputSecretCode();

  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Confirm new code");
  String confirmCode = inputSecretCode();

  if (newCode.equals(confirmCode)) {
    safeState.setCode(newCode);
    return true;
  } else {
    lcd.clear();
    lcd.setCursor(1, 0);
    lcd.print("Code mismatch");
    lcd.setCursor(0, 1);
    lcd.print("Safe not locked!");
    delay(2000);
    return false;
  }
}

void showUnlockMessage() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.write(ICON_UNLOCKED_CHAR);
  lcd.setCursor(4, 0);
  lcd.print("Unlocked!");
  lcd.setCursor(15, 0);
  lcd.write(ICON_UNLOCKED_CHAR);
  delay(1000);
}

void safeUnlockedLogic() {
  lcd.clear();

  lcd.setCursor(0, 0);
  lcd.write(ICON_UNLOCKED_CHAR);
  lcd.setCursor(2, 0);
  lcd.print(" # to lock");
  lcd.setCursor(15, 0);
  lcd.write(ICON_UNLOCKED_CHAR);

  bool newCodeNeeded = true;

  if (safeState.hasCode()) {
    lcd.setCursor(0, 1);
    lcd.print("  A = new code");
    newCodeNeeded = false;
  }

  auto key = keypad.getKey();
  while (key != 'A' && key != '#') {
    key = keypad.getKey();
  }

  bool readyToLock = true;
  if (key == 'A' || newCodeNeeded) {
    readyToLock = setNewCode();
  }

  if (readyToLock) {
    lcd.clear();
    lcd.setCursor(5, 0);
    lcd.write(ICON_UNLOCKED_CHAR);
    lcd.print(" ");
    lcd.write(ICON_RIGHT_ARROW);
    lcd.print(" ");
    lcd.write(ICON_LOCKED_CHAR);

    safeState.lock();
    lock();
    showWaitScreen(100);
  }
}

void safeLockedLogic() {
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.write(ICON_LOCKED_CHAR);
  lcd.print(" Safe Locked! ");
  lcd.write(ICON_LOCKED_CHAR);

  String userCode = inputSecretCode();
  bool unlockedSuccessfully = safeState.unlock(userCode);
  showWaitScreen(200);

  if (unlockedSuccessfully) {
    showUnlockMessage();
    unlock();
  } else {
    lcd.clear();
    lcd.setCursor(0, 0);
    lcd.print("Access Denied!");
    showWaitScreen(1000);
  }
}

void setup() {
  lcd.begin(16, 2);
  init_icons(lcd);

  lockServo.attach(SERVO_PIN);

  /* Make sure the physical lock is sync with the EEPROM state */
  Serial.begin(115200);
  if (safeState.locked()) {
    lock();
  } else {
    unlock();
  }

  showStartupMessage();
}

/* gac:start
   ✅ Keep your `loop()` function short.

   In this case, the app has two main states: the safe is either
   currently open or locked. Each of these states is handled by
   a dedicated function. This separation makes sure that each
   function is smaller and focused on a single task, and makes
   the code easier to understand and reason about.
*/
void loop() {
  if (safeState.locked()) {
    safeLockedLogic();
  } else {
    safeUnlockedLogic();
  }
}
/* gac:end */
