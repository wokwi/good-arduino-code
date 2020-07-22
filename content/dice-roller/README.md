A digital dice roller, controlled by Arduino. Each dice is represented by 7 LEDs
that are arranged according to standard [dice pip pattern](<https://en.wikipedia.org/wiki/Pip_(counting)>).

There are two dice and one button. Pressing the button rolls the dice, displays a sequence
of random numbers, followed by the result.

The LEDs are connected to the Arduino pins
as follows:

<img src="images/led-pins.png" alt="LED pin connections" style="width: 367px" />

### Hardware

| Item             | Quantity | Notes         |
| ---------------- | -------- | ------------- |
| Arduino Uno R3   | 1        |               |
| 5mm LED          | 14       | Red and Green |
| 12mm Push button | 1        |               |
| Resistor         | 14       | 220Ω          |

### Diagram

<figure>
    <img src="images/diagram.png" alt="diagram" style="width: 445px" />
    <figcaption>Dice roller connection diagram</figcaption>
</figure>

### Video Tutorial

<iframe width="560" height="315" src="https://www.youtube.com/embed/HaFf48j5sMc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
