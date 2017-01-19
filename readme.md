**How to build Connect 4 in JavaScript: A Tutorial --- by George Eng**

In order to build our connect 4 game, we will first need to write some functions to create the engine of the game. 

The first thing we need to do to create our Connect 4 Engine, is to create a few functions that will:  
1. Create a board (Array of Arrays)  
2. Create 3 different states (i.e. EMPTY, RED, YELLOW)  
3. Create a function that sets a value in the array without modifying the original.  
4. Create a Drop_Piece function.  



1. make_board will be a function that returns an array of arrays, with 7 columns, and 6 elements within each column.

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

2. Set EMPTY, RED, and YELLOW to values 0, 1, and 2 to represent the current state that a board is in.

```js
const EMPTY = 0
const RED = 1
const YELLOW = 2
```

3. replace will take an array, and return a new array with the element at index(i)

```js
var replace = function(arr, i, ele){

	var left = arr.slice(0,i)
	var right = arr.slice(i+1) //, arr.length)

	return left.concat([ele],right)
}
```

4. drop_piece allows us to take a board, and replace the first non empty space in a column.

```js
var drop_piece = function(board, col_index, piece){
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



//making boards immutable is important because we need the previous board states in order to implement the ai