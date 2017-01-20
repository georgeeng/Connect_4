const { sum, list, replace, max_by, max_index_by } = require('./utility')
const { EMPTY, RED, YELLOW, make_board, drop_piece, winner, switch_color, show_board } = require('./c4')

const log = console.log.bind(console)
const dir = x => console.dir(x, { depth: null })

const show_state = s =>
	s === EMPTY
		? '_'
	: s === RED
		? 'R'
		: 'Y'

// OPTIMIZATION
const k = x => () => x
const const_null = k(null)
const null_column = () => list(6)
const get_1 = x => x[1]
// OPTIMIZATION

// is a column full? i.e. no EMPTYs
const is_filled = col => col.indexOf(EMPTY) === -1

// ai function, if depth is zero, call base function, otherwise recurse on general case
const ai = (board, color, depth) =>
	depth === 0
		? ai_base(board, color)
		: ai_gen(board, color, depth)

// for every non-empty column, place the provided piece
// score each board with ascending and descending color_sum/streak_table (heuristic)
// return column-score pairs

function ai_base(board, color) {

	const picks = []

	for (let i = 0; i < 7; i++) {
		if (!is_filled(board[i])) {

			const next_board_red = drop_piece(board, i, color=RED)

			const descending_red = color_sum(streak_table(next_board_red, descend), color=RED)
			const ascending_red = color_sum(streak_table(next_board_red, ascend), color=RED)

			const score_red = ascending_red + descending_red
			// console.log(ascending_red, descending_red)

			///////////////////////////////////////////////////////////////////////////////////////////

			const next_board_yellow = drop_piece(board, i, color=YELLOW)

			const descending_yellow = color_sum(streak_table(next_board_yellow, descend), color=YELLOW)
			const ascending_yellow = color_sum(streak_table(next_board_yellow, ascend), color=YELLOW)
			
			const score_yellow = ascending_yellow + descending_yellow

			const score = score_yellow - score_red - 10

			// const score = score_red - score_yellow //really bad

			

			// const next_board = drop_piece(board, i, color)

			// const descending = color_sum(streak_table(next_board, descend), color)
			// const ascending = color_sum(streak_table(next_board, ascend), color)
			
			// const score = ascending + descending


			// // console.log(i, score)



			picks.push([i, score])

		}
	}
	// console.log(picks)
	return picks
}

// for every non-empty column, place the provided piece
// recurse on each board, taking the column-score lists from each
// pick best score from each board, use the best score to represent that column choice
// return new column-score pairs
function ai_gen(board, color, depth) {

	const picks = [];

	for (let i = 0; i < 7; i++) {
		if (!is_filled(board[i])) {
			const next_board = drop_piece(board, i, color)
			const next_picks = ai(next_board, switch_color(color), depth - 1)
			const pick = max_by(next_picks, get_1)

			picks.push([i, -pick[1]])
		}
	}

	return picks
}

// how valuable is a streak?
function weight(streak) {
	switch (streak) {
		case 1: return 1
		case 2: return 10
		case 3: return 100
		case 4: return 1000
	}
	return streak < 1 ? 0 : 1000
}

// get the score of a { plain, steal } entry
const streak_weight = entry => weight(entry.plain) + weight(entry.steal)

// takes a table of scores, calculates the total score for that color
function color_sum(scores, color) {
	let s = 0
	for (let i = 0; i < 7; i++) {
		for (let j = 0; j < 6; j++) {
			const score = scores[i][j]
			if (score.type === color) {
				s += sum(score.streaks.map(streak_weight))
			} else if (score.type === switch_color(color)) {
				s -= sum(score.streaks.map(streak_weight))
			}
		}
	}
	return s;
}

// heuristic: add one plain point for continuing a streak
function migrate(streaks, memo, i) {
	const streak = memo.streaks[i]
	streaks.push({
		plain: streak.plain + 1,
		steal: streak.steal
	})
	memo.streaks[i] = {
		plain: 0,
		steal: 0
	}
}

// heuristic: copy enemy's score by blocking
function steal(streaks, memo, i) {
	const streak = memo.streaks[i]
	streaks.push({
		plain: 1,
		steal: streak.plain
	})
}

// iteration schemes for memo traversal?
const descend = {
	direction: 1,
	iteration: (xss, cb) => {
		for (let i = 0; i < 7; i++) {
			for (let j = 0; j < 6; j++) {
				cb(i, j)
			}
		}
	}
}

const ascend = {
	direction: -1,
	iteration: (xss, cb) => {
		for (let i = 6; i >= 0; i--) {
			for (let j = 0; j < 6; j++) {
				cb(i, j)
			}
		}
	}
}

// is a coordinate pair valid
const valid = (i, j) => (0 <= i && i <= 6) && (0 <= j && j <= 5)

const empty_memo = { type: EMPTY }

//add_memo is being used in streak table which is the whole heuristic thing
const add_memo = (memo_mat, board, direction) => (i, j) => {
	const x = board[i][j]

	if (x === EMPTY) {
		memo_mat[i][j] = empty_memo
		return
	}

	const vi = i - direction
	const wi = j - 1
	const ei = j + 1

	// log({ vi, wi, ei, i, j })

	// vw, v, ve, w :: Memo
	const vw = !valid(vi, wi) ? empty_memo : memo_mat[vi][wi]
	const v  = !valid(vi, j ) ? empty_memo : memo_mat[vi][j]
	const ve = !valid(vi, ei) ? empty_memo : memo_mat[vi][ei]
	const w  = !valid(i , wi) ? empty_memo : memo_mat[i] [wi]

	const streaks = []


	//takes a previous memo, and direction. adds a new streak for that direction.
	function run(memo, i) {
		const { type } = memo
		if (type === EMPTY) {
			streaks.push({
				plain: 1,
				steal: 0
			})
		} else if (type === x) {
			migrate(streaks, memo, i)
		} else {
			// console.log(memo.streaks[i])
			if(memo.streaks[i].plain < 4){
				steal(streaks, memo, i)
			}else{
				streaks.push({plain: 1, steal: 0})
			}
		}
	}

	run(vw, 0)
	run(v, 1)
	run(ve, 2)
	run(w, 3)

	memo_mat[i][j] = { type: x, streaks }
}

// calculate ascending/descending score for a table
function streak_table(board, scheme) {
	const memo_mat = list(7, null_column)
	const { direction, iteration } = scheme

	iteration(memo_mat, add_memo(memo_mat, board, direction))

	return memo_mat
}
//16-193 ai



//streak_table takes down a board



//takes in the board and calculates the size of each streak
//will pass in 7 boards to the power of depth^2
// 7^2^2

function make_game(difficulty) {
	let board = make_board()
	let player = RED

	function switch_player() {
		player = player === RED ? YELLOW : RED
	}

	const api = {
		move(col) {
			board = drop_piece(board, col, player)

			switch_player()

			log(show_board(board))
			log()
			log()

			const winning = winner(board)

			if (winning !== EMPTY) {
				log(show_state(winning) + ' won!')
			}
		},
		move_ai() {
			const picks = ai(board, YELLOW, difficulty * 2)
			const pick_index = max_index_by(picks, get_1)
			const col = picks[pick_index][0]
			// log(picks, col)
			api.move(col)
		},
		move_1p(col) {
			api.move(col)
			api.move_ai()
		}
	}

	return api
}

const game = make_game(1)

const prompt = require('prompt-sync')();

while (true){
 let column = prompt("Select a column: ")
 game.move_1p(Number(column))
}


// ;[3].map(game.move_1p)
