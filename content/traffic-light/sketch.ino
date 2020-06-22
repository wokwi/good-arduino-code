#define RED 13
#define YELLOW 12
#define GREEN 11

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void loop() {
  digitalWrite(GREEN, HIGH);
  delay(3000);

  digitalWrite(GREEN, LOW);
  digitalWrite(YELLOW, HIGH);
  delay(500);

  digitalWrite(YELLOW, LOW);
  digitalWrite(RED, HIGH);
  delay(2000);

  digitalWrite(YELLOW, HIGH);
  delay(500);
  digitalWrite(YELLOW, LOW);
  digitalWrite(RED, LOW);
}
