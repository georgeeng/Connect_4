const EMPTY = 0
const RED = 1
const YELLOW = 2

const log = console.log.bind(console)
const dir = x => console.dir(x, { depth: null })

const show_state = s =>
	s === EMPTY
		? '_'
	: s === RED
		? 'R'
		: 'Y'

const show_column = col => col.map(show_state).join(' ')

const show_board = b => b.map(show_column).join('\n')

// OPTIMIZATION
const k = x => () => x

/*

thunk of x =
	() => x

thunk(x) = () => x

function thunk(x) {
	return () => x
}
*/
const const_null = k(null)
const const_empty = k(EMPTY)
const null_column = () => list(6)
const make_column = () => list(6, const_empty)
const get_1 = x => x[1]
// OPTIMIZATION

// create an empty array of length `n`, and `mapping` as initializer
const list = (n, mapping = const_null) => {
	const xs = Array(n)

	for (let i = 0; i < n; i++) {
		xs[i] = mapping(i)
	}
	return xs
}

// create an empty connect four board
const make_board = () => list(7, make_column)

const is_filled = col => col.indexOf(EMPTY) === -1

// creates a new array with value `v` at index `i`
function replace(arr, i, v) {
	const left = arr.slice(0, i)
	const right = arr.slice(i + 1)
	return left.concat([v], right)
}

// creates a new board with a piece placed in column `col`
function drop_piece(board, col, piece) {
	const column = board[col]

	const empty_index = column.indexOf(EMPTY)
	if (empty_index === -1) throw new Error('no empty pieces! in column: ' + col)

	const new_column = replace(column, empty_index, piece)
	const new_board = replace(board, col, new_column)

	return new_board
}

function max_index_by(xs, lens) {
	let mi = 0
	let m = lens(xs[0])

	for (let i = 1; i < xs.length; i++) {
		if (lens(xs[i]) > m) {
			mi = i
			m = lens(xs[i])
		}
	}

	return mi
}

const max_by = (xs, lens) => xs[max_index_by(xs, lens)]

const switch_color = c => c === RED ? YELLOW : RED

const ai = (board, color, depth) =>
	depth === 0
		? ai_base(board, color)
		: ai_gen(board, color, depth)

function ai_base(board, color) {
	const picks = []

	for (let i = 0; i < 7; i++) {
		if (!is_filled(board[i])) {
			const next_board = drop_piece(board, i, color)

			const descending = color_sum(streak_table(next_board, descend), color)
			const ascending = color_sum(streak_table(next_board, ascend), color)

			const score = ascending + descending
			picks.push([i, score])
		}
	}

	return picks
}

function ai_gen(board, color, depth) {
	const picks = []

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

const sum = xs => {
	let s = 0

	for (let i = 0; i < xs.length; i++) {
		s += xs[i]
	}

	return s
}

function weight(streak) {
	switch (streak) {
		case 1: return 1
		case 2: return 10
		case 3: return 100
		case 4: return 1000
	}
	return streak < 1 ? 0 : 1000
}

const streak_weight = entry => weight(entry.plain) + weight(entry.steal)

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

	return s
}

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

function steal(streaks, memo, i) {
	const streak = memo.streaks[i]
	streaks.push({
		plain: 1,
		steal: streak.plain
	})
}

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

const valid = (i, j) => (0 <= i && i <= 6) && (0 <= j && j <= 5)

const empty_memo = { type: EMPTY }

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

function streak_table(board, scheme) {
	const memo_mat = list(7, null_column)
	const { direction, iteration } = scheme

	iteration(memo_mat, add_memo(memo_mat, board, direction))

	return memo_mat
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

;[3,3,1,2,2,1,2,1,1,0,0,0,1,4,4].map(game.move_1p)



/*
function a(){
  console.log(this)
}

var b = a.bind(10);

b();*/
