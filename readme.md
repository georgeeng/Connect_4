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


The `Game` class keeps track of the board and the relevant streaks on the board, in an object called `totalStreaks`.

We will create