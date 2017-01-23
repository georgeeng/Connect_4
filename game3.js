const EMPTY = 0
const RED = 1
const YELLOW = 2

const replace = function(arr, i, x) {
	const left = arr.slice(0, i);
	const right = arr.slice(i + 1);
	return left.concat([x], right);
}

const drop_piece = function(board, col_index, piece){
	// if column in board piece has empty, replace with piece
	var col = board[col_index]

	for (let i = 0; i < 6; i++){
		if(col[i] === EMPTY){
			var new_column = replace(col, i, piece)
			var new_board = replace(board, col_index, new_column)
			return new_board
		}
	}

	return board;
}

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


//subtract yellow wants as many streaks
//red having as few streaks as possible
//the less streaks red has, the better yellow is doing


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




const prompt = require('prompt-sync')();
var gameBoard = [
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
]


// pseudo code
// var nextStates = next_states(myGame, YELLOW);

// var nextStatesScores = nextStates.map(function(game) {
//     return mini(game, 3);
// });

// var bestScore = Math.max(...nextStatesScores);
// var bestGameInd = nextStatesScores.indexOf(bestScore);



///MINIMAX!!!!!
//maxi will look at what mini

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
        //return drop_piece( something that will give us the highest board state right??? idk lol)
 		//return the move that gives max
 		//drop piece
}

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
	//return the move that picks min
}


var currentGame;
function ai_move(board) {

    currentGame = new Game(board)
    var nextStates = next_states(currentGame, YELLOW);

    var nextStatesScores = nextStates.map(function(game) {
        return mini(game, 3);
    });

    var bestScore = Math.max(...nextStatesScores);
    var bestGameInd = nextStatesScores.indexOf(bestScore);

    return drop_piece(board, bestGameInd, YELLOW)
}

while (true){
 let column = prompt("Select a column: ")
 if(column > 6){
 	console.log('Move must be between 0 and 6 mmkay')
 	continue;
 }
 console.log(`Dropping piece in column ${column}`);
 var gameBoard = drop_piece(gameBoard, Number(column), RED)

 var gameBoard = ai_move(gameBoard);

 console.log('gameBoard\n', gameBoard);
    if(currentGame.totalStreaks.red4 > 0){
        console.log('YOU WIN!!!!!!!!')
        break;
    }else if (currentGame.totalStreaks.yellow4 > 0) {
        console.log('COMPUTER WINS OH NOOOO')
        break;
    }
}

