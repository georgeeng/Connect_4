**How to build Connect 4 in JavaScript: A Tutorial --- by George Eng**

In order to build our connect 4 game, we will first need to write some functions to create the engine of the game. 

**Prerequisites for Building Connect 4 Engine**  
	- Understanding the fundamentals of Javascript  
	- Proficient in functional programming  

The first thing we need to do to create our Connect 4 Engine, is to create a few functions that will:  
1. Create a board (Array of Arrays)  
2. Create 3 different states (i.e. EMPTY, RED, YELLOW)  
3. Create a Drop_Piece function.  
4. Create a few utility functions i.e. a function that sets a value in the array, and returns a new array without modifying the original. Let's call this function `replace`.

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

The `Game` class keeps track of the board and the relevant streaks on the board, in an object called `totalStreaks`.  Total streaks will keep track of the current streaks within a game, so that we can set a value(score) to that certain game state. We have `red2open2` which equates to, player 'Red' has '2' streaks, and '2' open sides to it. This is good because it will allow us to 

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

Notice how the class `Game` has a few methods to it. This is because we need to count the vertical streaks and horizontal streaks, and then update our totalStreaks object. This will be important for our heuristics later on.  

Let us create a few methods on Games prototype, so that it will allow us to update the `totalStreaks` object, and count the streaks. 
  
We will implement `vertical_streaks` and `horizontal_streaks` first. 

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



### Now for the fun part: Minimax  

In the concept of Minimax, there is a 'Minimizing Player' and a 'Maximizing Player'. Let me explain what that means:
When playing a game, normally you want to get the highest score. You could say that you want to 'maximize' your score. When building an AI, it will need to maximize it's score in order to make a move that could lead to winning. There is no way to predict excatly what the Human player will do, and so we calculate all possibilitie moves. Then, we assume that the Human Player will want to 'minimize' the AI's score. They will probably pick a move that will lead to the AI losing. So we look at all possible moves the human could make after every possible move the AI could make.

That starts to look something like this:

![Minimax Tree1](http://i.imgur.com/S5I0Obn.jpg)


### But how do we calculate all possible moves?
We will do that with a function that we call 'next_states'.

```js
function next_states(game, color){
	var next_states_arr = [];
	for(let i = 0; i < 7; i++){
		const next_board = drop_piece(game.board, i, color);
		next_states_arr.push(next_board);
	}

	return next_states_arr.map(function(state) {
		return new Game(state);
        //returning an array of games
        //streaks need to be updated so create new instance of game with current state
	});
}
```

 Then we calculate the board state of each possible move the human will make.

 ###How do we calculate the board state?
 We will write another method on the Game's prototype. Let's call this method `getScore`. This `getScore` function will get the score of a specific board.

```js
Game.prototype.getScore = function() {
	var score = 0;

	// add values to the total score if there are streaks associated with the AI.
	score += this.totalStreaks.yellow2open1 * 10;
	score += this.totalStreaks.yellow2open2 * 100;
	score += this.totalStreaks.yellow3open1 * 200;
	score += this.totalStreaks.yellow3open2 * 2000;
	score += this.totalStreaks.yellow4 * 99999999999;

	// subtract values if there are streaks associated with the Human player.
	score -= this.totalStreaks.red2open1 * 10;
	score -= this.totalStreaks.red2open2 * 100;
	score -= this.totalStreaks.red3open1 * 200;
	score -= this.totalStreaks.red3open2 * 2000;
	score -= this.totalStreaks.red4 * 99999999999;


	return score;
}
```
We will value higher streaks higher, and ones with open ends even higher than that. Yellow (streak)4 and Red (streak)4 will have a very, very high score because, that is how you win this game! Yellow (our maximizing agent) will want as many streaks as possible, so we score that highly. While when Red has streaks, that is bad for us, so we subtract that from the score.

  We assume they will "minimize" the AI's score so we pick out the minimum valued board from each set of possible moves. Then we pick the best value we could possibly get to by choosing the maximum of the set of minimums we just finished building.  
  ```js
  function mini(game, depth) {
	if (depth === 0) {
        return game.getScore();
    }

    let min = Infinity;

    if (game.totalStreaks.red4 || game.totalStreaks.yellow4) {
        return game.getScore();
    }

    var nextStates = next_states(game, RED)

    for(let i = 0; i < 7; i++){
        let nextState = nextStates[i];
        let score = maxi(nextState, depth -1);

        if(score < min) {
            min = score;
        }
    }

    return min;
}
```
  



![Minimax Tree2](http://i.imgur.com/d2vfhTH.jpg)

You could say that we are trying to pick the "best" worst case scenerio of future board states. We know that we should try to maximize our AI's score, but we will do that with the fact that, a human player will try to minimize it's score, in mind.

```js
function maxi(game, depth) {
	if (depth === 0) {
		return game.getScore();
	}

	let max = -Infinity;
    //if terminal node has been reached return the heuristic 
	if (game.totalStreaks.red4 || game.totalStreaks.yellow4) {
		return game.getScore();
	}


 

 	// make an array of next game states
 	//PICKS HIGHEST SCORE WHILE ASSUMING PLAYER WILL PICK LOWEST SCORE
 	var nextStates = next_states(game, YELLOW)

 	for(let i = 0; i < 7; i++){
 		let nextState = nextStates[i];
 		let score = mini(nextState, depth - 1);

 		if (score > max) {
 			max = score;
 		}
 	}
 		return max;
}
```





