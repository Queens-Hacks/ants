# Hive
Hive is an online programming game where you write code, dig tunnels, find sugar, and build your colony!

## Game Mechanics
- Ants:
Your code runs inside each individual ant. Instruct them to find sugar and return it to the Hive in order to feed your colony and score points! However, ants have a poor sense of sight and cannot see further than one tile away. Ants dig through walls and carry sugar.

- Sugar:
Sugar is that good stuff that all ants crave. Located throughout the map in multicolored mounds of 20 sugar units, it's automatically picked up by any ant who walks over it. Collect more sugar than your opponent and win!
![sugar](https://github.com/Queens-Hacks/ants/blob/master/target/sugar.png)

- Home:
Home is your ant hill. Carry sugar back here to score points. `goto(home())` is a quick way to get back there when you have `hasFood()`!
![home](https://github.com/Queens-Hacks/ants/blob/master/target/house.png)

- Walls:
Walls can be dug out slowly by your ants. It takes 5 turns to destroy one wall.

- Pheromones:
Ants have poor sight but an excellent sense of smell! use `this.spray(object)` and `this.sniff()` to write and read data onto empty tiles. You can only read and write your colony's pheromones.
![trail](https://github.com/Queens-Hacks/ants/blob/master/target/Trails.png)

## Ant API and Objects
To interact with the environment, the ant must perform special operations. These are defined by the Ant API, which is documented below.

### Important Objects
#### Vectors
A vector object consists of two properties, an `x` point, and a `y` point. It is created by calling the `Vec(x, y)` function.
```javascript
var destination = Vec(5, 10);
```
There are some utility functions defined on `Vec` objects. These are defined below:
- `vec.norm()`
Returns the magnitude of the vector.
- `vec.add(vec2)`
Returns a vector containing the sum of `vec` and `vec2`
- `vec.sub(vec2)`
Returns a vector containing `vec - vec2`
- `vec.scale(scalar)`
Returns a the vector `vec`, scaled by the scalar `scalar`
- `vec.dot(vec2)`
Returns the dot product of `vec` and `vec2`
- `vec.clone()`
Returns a copy of the vector `vec`

#### Directions
Directions in the API are represented as strings. They can take one of the following values:
`'up'`, `'down'`, `'left'`, `'right'`, `'here'`.

### Useful Functions
#### Getting around
- `move(direction)`
Takes a direction string, and moves the ant in that direction. If the path is obstructed by an edge of wall, false is returned, and the wall is dug. This function ends a turn.

```javascript
move('down');
```

- `wait()`
Wait for a turn, doing nothing.

- `goto(location)`
Takes a location vector, and moves the ant to that location. It first travels along the `x` axis, followed by the `y` axis. It will dig out any blocks which are in the way.

```javascript
goto(Vec(10, 22));
```

#### Look around you
- `getTeam()`
Returns your current team, as the string `'pink'` (upper left corner) or `'blue'` (lower right corner).
- `location()`
Returns the ant's location, as a vector.
- `home()`
Returns your ant hill's location, as a vector.
- `hasFood()`
Returns a `true` if you are carrying food, and `false` if your ant's mouth is empty.
- `look(direction)`
Returns the type of the block found in direction, relative to your current co-ordinates.
```javascript
if(look('left') === "sugar")
    move('left');
```
Valid return values are: `['empty', 'wall', 'sugar', 'home', false]`. `false` is returned when looking off the edge of the sandbox.
- `foodLeft(direction)`
Returns the number of sugar units still remaining at the sugar block in the direction specified by the passed-in direction string.

#### Spray n' Sniff
- `spray(pheromone)`
Writes a pheromone to the ant's current location. The pheromone must be valid JSON data.
If there is currently a pheromone at that location, it is overridden.
- `sniff()`
Returns the pheromone at the ant's current location, if any. If there is no pheromone, returns `null`.

#### Utility
- `randDir()`
Generate a random direction string out of `'up'`, `'down'`, `'left'`, and `'right'`.

#### Debugging
- `log(message...)`
Print the message passed in to the debug console (located above the source code).

## Example Script
Using these elements, we can make some pretty interesting AIs for our ants!

Here's an annotated example of a script which wanders somewhat randomly throughout the environment, going home if it discovers food:

```javascript
var dir = randDir();

while (true) { // Loop forever!
    if (! hasFood()) {
        // As long as you haven't found food yet, move in a random direction
        if (Math.random() < .5) { // 5% chance of changing dir to a new
            dir = randDir();      // random direction
        }

        move(dir); // Move in the direction we have previously randomly generated
    } else {
        // Go home with the sugar!
        goto(home());
    }
}
```

Of course, there is a ton more interesting stuff you can do, once you start bringing in memory, pheromones, and more!

Experiment, and play with the scripts to make the best ant colony possible.
