const { list, replace } = require('./utility')

const EMPTY = 0
const RED = 1
const YELLOW = 2

// make_board :: [[state]]
const make_board = () => list(7, make_column)

const show_state = s =>
	s === EMPTY
		? '_'
	: s === RED
		? 'R'
		: 'Y'

const const_null = () => null
const make_column = () => list(6, () => EMPTY)
const null_column = () => list(6)
const switch_color = c => c === RED ? YELLOW : RED




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
	throw new Error("No empty pieces!");
}

function scores(board) {
	const memo_mat = list(7, null_column)

	// Memo {
	//   type :: state,
	//   streaks :: [Int]
	// }

	// empty_memo :: Memo
	const empty_memo = {
		type: EMPTY,
		streaks: [0, 0, 0, 0]
	}

	function compute_memo(i, j) {
		const x = board[i][j]

		if (x === EMPTY) {
			return empty_memo
		}

		const ni = i - 1
		const wi = j - 1
		const ei = j + 1

		// nw, n, ne, w :: Memo
		const nw = (ni < 0 || wi < 0) ? empty_memo : memo_mat[ni][wi]
		const n  = (ni < 0)           ? empty_memo : memo_mat[ni][j]
		const ne = (ni < 0 || ei > 5) ? empty_memo : memo_mat[ni][ei]
		const w  = (wi < 0)           ? empty_memo : memo_mat[i] [wi]

		const memo = {
			type: x,
			streaks: [
				nw.type === x ? nw.streaks[0] + 1 : 1,
				n .type === x ? n .streaks[1] + 1 : 1,
				ne.type === x ? ne.streaks[2] + 1 : 1,
				w .type === x ? w .streaks[3] + 1 : 1
			]
		}

		return memo
	}

	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 6; j++) {
			memo_mat[i][j] = compute_memo(i, j)
		}
	}

	return memo_mat
}

function winner(board) {
	const memo_mat = scores(board)

	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 6; j++) {
			const memo = memo_mat[i][j]
			if (memo.streaks.includes(4)) return memo.type
		}
	}

	return EMPTY
}

const show_column = col => col.map(show_state).join(' ')

const show_board = b => b.map(show_column).join('\n')	

module.exports = {
	EMPTY,
	RED,
	YELLOW,
	switch_color,
	make_board,
	drop_piece,
	winner,
	show_state,
	show_column,
	show_board
}