**How to build Connect 4 in JavaScript: A Tutorial --- by George Eng**

In order to build our connect 4 game, we will first need to write some functions to create the engine of the game. 

**Prerequisites for Building Connect 4 Engine**  
	- Understanding the fundamentals of Javascript  
	- Proficient in functional programming  

The first thing we need to do to create our Connect 4 Engine, is to create a few functions that will:  
1. Create a board (Array of Arrays)  
2. Create 3 different states (i.e. EMPTY, RED, YELLOW)  
3. Create a Drop_Piece function.  
4. Create a few utility functions i.e. a function that sets a value in the array, and returns a new array without modifying the original.  



1. 
Let's write a function that will generate a "board", will give us a 7x6 game board.
The function `make_board` will be a function that returns an array of arrays, with 7 columns, and 6 elements within each column.

```js
const const_null = () => null
var make_column = () => list(6, () => EMPTY)
const make_board = () => list(7, make_column)

	var list = (length, init = const_null) => {
		var arr = Array(length)
		for (let i = 0; i < length; i++){
			arr[i] = init(i)
			// console.log('init(i) >>> ',i , init(i))
		}
		return arr;
}
```

2. Set `EMPTY`, `RED`, and `YELLOW` to values `0`, `1`, and `2` to represent the current state that a board is in. These values will be passed into our board, to indicate what state a particular spot is in currently.

```js
const EMPTY = 0
const RED = 1
const YELLOW = 2
```


3. The function `drop_piece` allows us to take a board, and replace the first non empty space in a column.

```js
function drop_piece(board, col_index, piece){
	// if column in board piece has empty, replace with piece
	var col = board[col_index]

	for (let i = 0; i < 6; i++){
		if(col[i] === EMPTY){
			var new_column = replace(col, i, piece)
			var new_board = replace(board, col_index, new_column)
			return new_board
		}
	}
	throw new Error("No empty pieces!");
}
```
4. The function `replace` will take an array, and return a new array with the element at index(i). Replace is one of the many utility functions that we will be using for our game.

```js
function replace(arr, i, ele){
	var left = arr.slice(0,i)
	var right = arr.slice(i+1) // 2nd paramater in this case will === arr.length
	return left.concat([ele],right)
}
```

Here are a list of other functions that we will use for our game:


```js
const sum = xs => {
	let s = 0;

	for (let i = 0; i < xs.length; i++) {
		s += xs[i];
	}
	return s;
}

function id(x) {
	return x;
}

function max(arr){
	return max_by(arr, id);

	// var result = arr[0];
	// for(let i = 1; i < arr.length; i++){
	// 	if(result < arr[i]){
	// 		result = arr[i];
	// 	}
	// }
	// return result;
}

function max_index(arr){

	return max_index_by(arr,id);

	// var largestNumber = arr[0]
	// var result = 0;
	// for(let i = 1; i < arr.length; i++){
	// 	if(largestNumber < arr[i]){	
	// 		largestNumber = arr[i];
	// 		result = i;
	// 	}
	// }
	// return result;
}

function max_by(arr, value){
	var index = max_index_by(arr, value);
	return arr[index];

	// var result = arr[0];
	// var maxNumber = value(result);
	// for(let i = 1; i < arr.length; i++){
	// 	if(maxNumber < value(arr[i])){
	// 		maxNumber = value(arr[i]);
	// 		result = arr[i]
	// 	}
	// }
	// return result;
}

function max_index_by(arr, value){
	var index = 0;
	var maxValue = value(arr[0]);
	for(let i = 1; i < arr.length; i++){
		let nextValue = value(arr[i])
		if(maxValue < nextValue){
			maxValue = nextValue
			index = i;
		}
	}
	return index;
}
```

Some insight that I have gained throughout writing this program was the ability to reuse code within functions; this will make things run faster by having less for loops and less scripts. Though it may be irrelevant from creating the game--I wanted to share my eye opening experience by writing functions differently.  
  
Notice at the above code how they are using each other. This is a great example of being efficient with functional programming as we can utilize one function, and reuse that function within other functions. I have commented out what the functions would be doing if they were independent of each other to demonstrate contrast.  
  
Take these utility functions, put them into a utility.js file. This is just to keep things simple and clean!  
Last but not least, we will need to export these functions within this file so that other files can use them.  

```js
module.exports = {
	sum, id,
	max, max_index, max_by, max_index_by,
	list, replace
}
```

***Now, that we have our data structure set up for the game... Here comes the fun part!***

We will need to keep track of the 










//making boards immutable is important because we need the previous board states in order to implement the ai