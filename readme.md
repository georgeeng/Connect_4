**How to build Connect 4 in JavaScript: A Tutorial --- by George Eng**

In order to build our connect 4 game, we will first need to write some functions to create the engine of the game. 

**Prerequisites for Building Connect 4 Engine**  
	- Understanding the fundamentals of Javascript  
	- Proficient in functional programming  

The first thing we need to do to create our Connect 4 Engine, is to create a few functions that will:  
1. Create a board (Array of Arrays)  
2. Create 3 different states (i.e. EMPTY, RED, YELLOW)  
3. Create a Drop_Piece function.  
4. Create a few utility functions i.e. a function that sets a value in the array, and returns a new array without modifying the original. `replace`

1.
```js
var gameBoard = [
	[0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
]  
```

Using an Array of Arrays for Connect 4 makes the data easy to iterate through. 

2. Set `EMPTY`, `RED`, and `YELLOW` to values `0`, `1`, and `2` to represent the current state that a board is in. These values will be passed into our board, to indicate what state a particular spot is in currently.

```js
const EMPTY = 0
const RED = 1
const YELLOW = 2
```

//More

The `Game` class keeps track of the board and the relevant streaks on the board, in an object called `totalStreaks`.

```js

function Game(board) {
    this.totalStreaks = {
        red2open2: 0,
        yellow2open2: 0,
        red3open2: 0,
        yellow3open2: 0,

        red2open1: 0,
        yellow2open1: 0,
        red3open1: 0,
        yellow3open1: 0,
        red4: 0,
        yellow4: 0
    }

    this.board = board;

    this.vertical_streaks();
    this.horizontal_streaks();
}
```

  
Next we will need to create a few methods on Games prototype that will allow us to update the `totalStreaks` object.  
  
We will implement `vertical_streaks`, `horizontal_streaks`, and `getScore`.  

```js
Game.prototype.vertical_streaks = function() {
    var redStreak = 0;
    var yellowStreak = 0;

    for (let i = 0; i < this.board.length; i++) {
        let row = this.board[i];
        redStreak = 0;
        yellowStreak = 0;

        for (let j = 0; j < row.length; j++) {
            let space = row[j];

            if (redStreak === 4) {
                this.totalStreaks.red4 += 1;
            } else if (yellowStreak === 4) {
                this.totalStreaks.yellow4 += 1;
            }

            if (space === 1) {
                if (yellowStreak > 0) {
                    yellowStreak = 0;
                }

                redStreak++;
            } else if (space === 2) {
                if (redStreak > 0) {
                    redStreak = 0;
                }

                yellowStreak++;
            } else if (space === 0){
                if (redStreak === 2) {
                        this.totalStreaks.red2open1 += 1;
                    } else if(redStreak === 3) {
                        this.totalStreaks.red3open1 += 1;
                }
                if (yellowStreak === 2) {
                        this.totalStreaks.yellow2open1 += 1;
                    } else if(yellowStreak === 3) {
                        this.totalStreaks.yellow3open1 += 1;
                }
                redStreak = 0;
                yellowStreak = 0;
            }
        }
    }
}  

Game.prototype.horizontal_streaks = function() {

    var spaceOpen = false;
    var redStreak = 0;
    var yellowStreak = 0;

    for (let y = 0; y < this.board[0].length; y++) {
        redStreak = 0;
        yellowStreak = 0;
        spaceOpen = false;

        for (let x = 0; x < this.board.length; x++) {
            let space = this.board[x][y];
            // let nextSpace = this.board[x+1][y]
            if (redStreak === 4) {
                this.totalStreaks.red4 += 1;
            } else if (yellowStreak === 4) {
                this.totalStreaks.yellow4 += 1;
            }

            if (space === 1) {
                if (yellowStreak > 0) {
                    if (spaceOpen) {
                        if(yellowStreak === 2) {
                            this.totalStreaks.yellow2open1 += 1;
                        } else if (yellowStreak === 3) {
                            this.totalStreaks.yellow3open1 += 1;
                        }
                    }
                    yellowStreak = 0;
                    spaceOpen = false
                }
                redStreak++;
            } else if (space === 2) {
                if (redStreak > 0) {
                    if (spaceOpen) {
                        if(redStreak === 2) {
                            this.totalStreaks.red2open1 += 1;
                        } else if (redStreak === 3) {
                            this.totalStreaks.red3open1 += 1;
                        }
                    }
                    redStreak = 0;
                    spaceOpen = false
                }
                yellowStreak++;
            } else if (space === 0){
                if (yellowStreak === 2) {
                        if (spaceOpen === true){
                            this.totalStreaks.yellow2open2 += 1;
                        } else {
                            this.totalStreaks.yellow2open1 += 1;
                        }
                    }else if(yellowStreak === 3) {
                        if (spaceOpen === true){
                            this.totalStreaks.yellow3open2 += 1;
                        } else {
                            this.totalStreaks.yellow3open1 += 1;
                        }
                }
                if (redStreak === 2) {
                        if (spaceOpen === true){
                            this.totalStreaks.red2open2 += 1;
                        } else {
                            this.totalStreaks.red2open1 += 1;
                        }
                    }else if(redStreak === 3) {
                        if (spaceOpen === true){
                            this.totalStreaks.red3open2 += 1;
                        } else {
                            this.totalStreaks.red3open1 += 1;
                        }
                }

                redStreak = 0;
                yellowStreak = 0;
                spaceOpen = true;
            }
        }
    }
}



// Game.prototype.diagonal_streak1 = function(){

// }	
```

//subtract yellow wants as many streaks
//red having as few streaks as possible
//the less streaks red has, the better yellow is doing

```js
Game.prototype.getScore = function() {
	var score = 0;

	score += this.totalStreaks.yellow2open1 * 10;
	score += this.totalStreaks.yellow2open2 * 100;
	score += this.totalStreaks.yellow3open1 * 200;
	score += this.totalStreaks.yellow3open2 * 2000;
	score += this.totalStreaks.yellow4 * 99999999999;

	score -= this.totalStreaks.red2open1 * 10;
	score -= this.totalStreaks.red2open2 * 100;
	score -= this.totalStreaks.red3open1 * 200;
	score -= this.totalStreaks.red3open2 * 2000;
	score -= this.totalStreaks.red4 * 99999999999;


	return score;
}
```












