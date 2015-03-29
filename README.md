# Hivep
Hive is an online programming game where you write code, dig tunnels, find sugar, and build your colony!

### Game Mechanics
- Ants:
    Your code runs inside each individual ant. Instruct them to find sugar and return it to the Hive in order to feed your colony
    and score points! However, ants have a poor sense of sight and cannot see further than one tile away. 
    Ants dig through walls and carry sugar.
- Sugar: 
 Sugar is that good stuff that all ants crave. Located throughout the map in multicolored mounds of 20 sugar units, it's
automatically picked up by any ant who walks over it. Collect more sugar than your opponent and win! 
- Home:
Home is your ant hill. Carry sugar back here to score points. 

``` 
this.goto(this.home()) 
``` 
will take you here, but won't avoid walls.'
- Walls:
Walls can be dug out slowly by your ants. It takes 5 movements to destroy one wall
- Pheromones:
Ants have poor sight but excellent vision! use this.spray(object) and this.sniff() to write and read data onto 
empty tiles. Spraying overwrites pheromones from your own team, but different colonies pheromones can co-exist.
    
### Ant API
 - These functions are special calls you can make into the game engine to interact with your environment! 
 - location objects have .x and .y properties. 0,0 is the top left corner, and the bottom right is 49,79. You can make new location objects with:

 ```
 locate = { x: = 10, y: = 22 };
 ```
 - valid direction objects are 'up', 'down', 'left', and 'right'.

### Getting around
- move
 This function takes in a direction string  and moves the ant in the direction. If the path is obstructed by a 
edge or wall, false is returned and the ant won't move. This function ends a turn.

    ```
    move('right');
    ```
- dig
    This function takes in a direction string and digs in the direction, if no wall is found, false is returned. Otherwise, true. This function ends a turn.

    ```
    dig('up');
    ```
- moveDig
    This function combines the roles of move and dig. it takes in the same arguments as them, and will try to dig a wall, if no wall is found or if the wall is destroyed, then the ant will continue. This function ends a turn.

    ```
    moveDig('down');
    ```
- goto()
    This function is the easiest way to get from your current location to the point 'Point'. It zigzags there, and will dig through any walls in the way. Not very efficient!

    ```
    goto(10, 22); // may take many turns!
    ```

### Look around you
  - getTeam()
    Returns your current team, as a string 'tl' or 'br', meaning top left and bottom right
  - location() 
    Returns a location object with .x and .y properties 
  - home() 
    Returns your ant hills location object with .x and .y properties
  - hasFood()
    Returns a true if you are carrying food, false if ant's mouth is empty 
  - look(direction)
    Returns the type of the block found in direction, relative to your current co-ordinates.

    ```if(look('left')==="sugar") move('left');```
    Valid types are: 'empty','wall','sugar','home'. Returns false when looking off the edge of the sandbox.
  - foodLeft(direction)
    Returns an integer value of remaining sugar units if directed at sugar block, otherwise returns false

 
### Spray n' Sniff
 - spray(pheromone) 
      Writes an object to the current location.   
 - sniff() 
      Returns any allied pheromone sprayed on current tile 

### ETC
 - log(message)
    Prints debug information to your columns console
    
### Example
    Using these elements, we can make some pretty interesting AIs for our ants!
    
    Here's an annotated example:

    ```
var dir = Math.random(); // random number between 0 and 1

while (true) {
    if (hasFood() === false) {
        if(Math.random() > .95) { // 5% chance of changing dir to a new 
            dir = Math.random();  // random direction
        }

        if (dir < 0.25) { // divide up dir into directions, and move()!
            move('down');
        } else if (dir < 0.5) {
            move('up');
        } else if (dir < 0.75) {
            move('right');
        } else {
            move('left');
        }
    } else {
        goto(home());
    }
} // start over at top!

    ```
