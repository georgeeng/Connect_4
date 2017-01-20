const { max_index_by } = require('./utility')
const { RED, YELLOW, make_board, drop_piece } = require('./c4')

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
