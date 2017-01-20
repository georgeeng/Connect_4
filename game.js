'use strict'
const EMPTY = 0
const RED = 1
const YELLOW = 2

const log = console.log.bind(console)

function show_state(state) {
  return state === EMPTY ? '_' : state === RED ? 'R' : 'Y'
}

function show_column(arr) {
  return arr.map(show_state).join(' ')
}

function show_board(board) {
  return board.map(show_column).join('\n')
}

// create an empty array of length `n`
function empty_array(n) {
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(null)
  }
  return result
}

// create an empty connect four board
function make_empty_board() {
  const result = []
  for (let i = 0; i < 7; i++) {
    const column = empty_array(6).fill(EMPTY)
    result.push(column)
  }
  return result
}

function is_filled(column) {
  return column.indexOf(EMPTY) === -1
}

// creates a new array with value `v` at index `i`
function replace(arr, i, v) {
  const left = arr.slice(0, i)
  const right = arr.slice(i + 1)
  return [].concat(left, [v], right)
}

// creates a new board with a piece placed in column `col`
function drop_piece(board, col, piece) {
  const column = board[col]
  const empty_index = column.indexOf(EMPTY)
  if (empty_index === -1) throw new Error('no empty pieces!')
  const new_column = replace(column, empty_index, piece)
  
  const new_board = replace(board, col, new_column)
  
  return new_board
}

function sq(x) { // ikik
  return Math.pow(x, 1.4)
}

function cb(x) {
  return Math.pow(x, 1.7)
}

function hyp(x) {
  return Math.pow(x, x)
}

function scary_h(x) {
  return sq(x.y) - sq(x.r + .5)
}

function h(x) {
  return x.y - x.r
}

function ai(board, color, depth = 0) {
  if (depth === 0) {
    return ai_base(board, color)
  } else {
    return ai_gen(board, color, depth)
  }
}

/*
function ai_base(board) {
  const picks_1 = []
    
  for (let i = 0; i < 7; i++) {
    if (is_filled(board[i])) {
      picks_1.push(-9999)
    } else {
      const board_1 = drop_piece(board, i, YELLOW)
      const scores = scores_mod(board_1)
      // log('---')
      const scores_rev = scores_mod_rev(board_1)
      // log('---')
      const max_1 = config_sum(scores)
      const max_2 = config_sum(scores_rev)
      const h_3 = hori_score(board_1)
      // log(h(max_1), h(max_2))
      // log('---')
      const pick_1 = scary_h(max_1) + scary_h(max_2) + h_3
      picks_1.push(pick_1)
    }
  }
  
  // log(picks_1)
    
  return picks_1
}
*/

function maxi_by(xs, lens) {
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

function mini_by(xs, lens) {
  let mi = 0
  let m = lens(xs[0])
  
  for (let i = 1; i < xs.length; i++) {
    if (lens(xs[i]) < m) {
      mi = i
      m = lens(xs[i])
    }
  }
  
  return mi
}

function switch_color(c) {
  if (c === RED) {
    return YELLOW
  } else {
    return RED
  }
}

function ai_base(board, color) {
  const picks = []
    
  for (let i = 0; i < 7; i++) {
    if (!is_filled(board[i])) {
      const next_board = drop_piece(board, i, color)
      const s = scores_idem(next_board)
      // log(s.map(t => t.map(u => sum(u.streaks)).join(' ')).join('\n'))
      const pick = color_sum(s, color)
      picks.push([i, pick])
    }
  }
  // log('ab', picks)
  
  return picks
}


function ai_gen(board, color, depth) {
  const picks = []
    
  for (let i = 0; i < 7; i++) {
    if (!is_filled(board[i])) {
      const next_board = drop_piece(board, i, color)
      const next_picks = ai(next_board, switch_color(color), depth - 1)
      picks.push(next_picks[mini_by(next_picks, x => x[1])])
    }
  }
  // log('ag', picks)
  
  return picks
}
/*
function ai_gen(board, depth) {
  const picks_1 = []
    
  for (let i = 0; i < 7; i++) {
    if (is_filled(board[i])) {
      picks_1.push(-9999)
    } else {
      const board_1 = drop_piece(board, i, YELLOW)

      const picks_2 = []
      for (let j = 0; j < 7; j++) {
        if (is_filled(board_1[j])) {
          picks_2.push(-9999)
        } else {
          const board_2 = drop_piece(board_1, j, RED)
          const pick_2 = max(ai(board_2, depth - 1))
          picks_2.push(pick_2)
        }
      }

      picks_1.push(max(picks_2))
    }
  }
  
  return picks_1
}
*/


function do_magic_ai_stuff(board, player, depth = 0) {
  if (depth === 0) {
    return do_magic_ai_stuff_base(board, player)
  } else {
    const best_col = do_magic_ai_stuff(board, player, depth - 1)
  }
}


function do_magic_ai_stuff_base(board, player) {
  const next_boards = []
  
  for (let i = 0; i < 7; i++) {
    next_boards.push(drop_piece(board, i, player))
  }
  
  //for each gamestate, every possible i is turned into a board, we've generated a board for each column.
  //for every board we generated a scores matrix winner function
  //for every scores matrix we grabbed largest streaks
       
  // const next_boards = empty_array(7).map((_, i) => drop_piece(board, i, player))
  
  const next_maxes = next_boards.map(scores).map(max_streaks)
  
  // heuristic function !!!!!
  function h(x) {
    // me minus him
    return x.y - x.r
  }
  
  const next_picks = next_maxes.map(h)
  
  //list of numbers that takes the first index as 
  
  const best_col = max_index(next_picks)

  log(next_boards)
  
  return best_col
}


function max_index(xs) {
  let mi = 0
  let m = xs[0]
  
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] > m) {
      mi = i
      m = xs[i]
    }
  }
  
  return mi
}

function max(xs) {
  let m = xs[0]
  
  for (let i = 1; i < xs.length; i++) {
    if (xs[i] > m) {
      m = xs[i]
    }
  }
  
  return m
}

function sum(xs) {
  return xs.reduce((a, b) => a + b, 0)
}

function color_sum(scores, color) {
  let s = 0
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      const score = scores[i][j]
      if (score.type === color) {
        const a = score.streaks.find(x => x > 1)
        s += sum(score.streaks)
      }
    }
  }
  
  return s
}

function config_sum(scores) {
  let r = 0
  let y = 0
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      const memo = scores[i][j]
      
      if (memo.type === RED) {
        r += sum(memo.streaks)
      } else if (memo.type === YELLOW) {
        y += sum(memo.streaks)
      }
    }
  }
  
  return { r, y }
}

function max_streaks(scores) {
  let r_max = 0
  let y_max = 0
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      const memo = scores[i][j]
      
      if (memo.type === RED) {
        const max_streak = max(memo.streaks)
        //checks largest streak
        if (max_streak > r_max) {
          r_max = max_streak
        }
      } else if (memo.type === YELLOW) {
        const max_streak = max(memo.streaks)
        if (max_streak > y_max) {
          y_max = max_streak
        }
      }
    }
  }
  
  return {
    r: r_max,
    y: y_max
  }


}

function make_game() {
  let board = make_empty_board()
  let player = RED
  
  function switch_player() {
    player = player === RED ? YELLOW : RED
  }
  
  const api = {
    move(col) {
      board = drop_piece(board, col, player)
      
      switch_player()
      
      log(show_board(board))
      
      const winning = winner(board)
      if (winning !== EMPTY) {
        log(show_state(winning) + ' won!')
      }
    },
    move_ai() {
      const picks = ai(board, YELLOW, 2)
      log(picks)
      const col = maxi_by(picks, x => x[1])
      api.move(col)
    },
    move_1p(col) {
      api.move(col)
      api.move_ai()
    }
  }
  
  return api
}

const game = make_game()


//run game

;[3, 4].map(game.move_1p)
// log(do_magic_ai_stuff())

// let board_test = [
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
//   [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,EMPTY]
//   ]


  

/*
game.move(2)
game.move(1)

game.move(3)
game.move(2)

game.move(3)
game.move(4)

game.move(0)
game.move(3)

game.move(4)
game.move(4)

game.move(5)
game.move(4)
*/

function square(x) {
  return x * x
}
    
function migrate_big(streaks, memo, i) {
  streaks.push(memo.streaks[i] + 1)
  // memo.streaks[i] = 0
}

function migrate(streaks, memo, i) {
  streaks.push(memo.streaks[i])
  memo.streaks[i] = 0
}

function block(streaks, memo, i) {
  const last = memo.streaks[i]
  
  if (last < 5) {
    streaks.push(last * last)
  } else {
    streaks.push(last + 1)
  }
  // streaks.push(memo.streaks[i] + 1)
  // memo.streaks[i]--
}

function hori_score(board) {
  let horis = 0
  
  for (let j = 0; j < 6; j++) {
    let hori = 0
    for (let i = 0; i < 7; i++) {
      if (board[i][j]) hori++
    }
    horis += hori * hori
  }
  
  return horis
}

function scores_idem(board) {
  const memo_mat = empty_array(7).map(() => empty_array(6))
  
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
    
    const streaks = []
   
    function run(memo, i) {
      const { type } = memo
      if (type === x) {
        migrate_big(streaks, memo, i)
      } else {
        streaks.push(1)
      }
    }
    
    run(nw, 0)
    run(n, 1)
    run(ne, 2)
    run(w, 3)
      
    return { type: x, streaks }
  }
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      memo_mat[i][j] = compute_memo(i, j)
    }
  }
  
  return memo_mat
}

function scores_mod(board) {
  const memo_mat = empty_array(7).map(() => empty_array(6))
  
  // Memo
  // {
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
    
    /*
    function invalid(i, j) {
      return i < 0 || j < 0 || i > 6 || j > 5
    }
    
    const nw = invalid(ni) || invalid(wi) ? empty_memo : memo_mat[ni][wi]
    const n  = invalid(ni) || invalid(j)  ? empty_memo : memo_mat[ni][j]
    const ne = invalid(ni) || invalid(ei) ? empty_memo : memo_mat[ni][ei]
    const w  = invalid(i)  || invalid(wi) ? empty_memo : memo_mat[i] [wi]
    */
    
    const streaks = []
   
    function run(memo, i) {
      const { type } = memo
      if (type === x) {
        migrate(streaks, memo, i)
      } else if (type === EMPTY) {
        streaks.push(1)
      } else {
        block(streaks, memo, i)
      }
    }
    
    run(nw, 0)
    run(n, 1)
    run(ne, 2)
    run(w, 3)
      
    const memo = {
      type: x,
      streaks
    }
    
    return memo
  }
  
  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 6; j++) {
      memo_mat[i][j] = compute_memo(i, j)
    }
  }
  
  // log(memo_mat.map(sc => sc.map(s => sum(s.streaks)).join(' ')).join('\n\n'))
  // log()
  return memo_mat
}

function scores_mod_rev(board) {
  const memo_mat = empty_array(7).map(() => empty_array(6))
  
  // Memo
  // {
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
    
    const si = i + 1
    const ei = j + 1
    const wi = j - 1
    
    // nw, n, ne, w :: Memo
    const se = (si > 6 || ei > 5) ? empty_memo : memo_mat[si][ei]
    const s  = (si > 6)           ? empty_memo : memo_mat[si][j]
    const sw = (si > 6 || wi < 0) ? empty_memo : memo_mat[si][wi]
    const e  = (ei > 5)           ? empty_memo : memo_mat[i] [ei]
    
    /*
    function invalid(i, j) {
      return i < 0 || j < 0 || i > 6 || j > 5
    }
    
    const nw = invalid(ni) || invalid(wi) ? empty_memo : memo_mat[ni][wi]
    const n  = invalid(ni) || invalid(j)  ? empty_memo : memo_mat[ni][j]
    const ne = invalid(ni) || invalid(ei) ? empty_memo : memo_mat[ni][ei]
    const w  = invalid(i)  || invalid(wi) ? empty_memo : memo_mat[i] [wi]
    */
    
    const streaks = []
   
    function run(memo, i) {
      const { type } = memo
      if (type === x) {
        migrate(streaks, memo, i)
      } else if (type === EMPTY) {
        streaks.push(1)
      } else {
        block(streaks, memo, i)
      }
    }
    
    run(se, 0)
    run(s, 1)
    run(sw, 2)
    run(e, 3)
      
    const memo = {
      type: x,
      streaks
    }
    
    return memo
  }
  
  for (let i = 6; i >= 0; i--) {
    for (let j = 5; j >= 0; j--) {
      memo_mat[i][j] = compute_memo(i, j)
    }
  }
  
  // log(memo_mat.map(sc => sc.map(s => sum(s.streaks)).join(' ')).join('\n\n'))
  // log()
  return memo_mat
}

function scores(board) {
  const memo_mat = empty_array(7).map(() => empty_array(6))
  
  // Memo
  // {
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
    
    /*
    function invalid(i, j) {
      return i < 0 || j < 0 || i > 6 || j > 5
    }
    
    const nw = invalid(ni) || invalid(wi) ? empty_memo : memo_mat[ni][wi]
    const n  = invalid(ni) || invalid(j)  ? empty_memo : memo_mat[ni][j]
    const ne = invalid(ni) || invalid(ei) ? empty_memo : memo_mat[ni][ei]
    const w  = invalid(i)  || invalid(wi) ? empty_memo : memo_mat[i] [wi]
    */
    
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



/*
_ _ _ _ _ _
R Y R Y _ _
R R Y _ _ _
Y Y R _ _ _
Y R _ _ _ _
_ _ _ _ _ _
_ _ _ _ _ _

Y won!

0 0 0 0 0 0
R(1SE, 1S, 1SW, 1E) Y(1SE, 1S, 1SW, 1E) R(1SE, 1S, 1SW, 1E) Y(1SE, 1S, 1SW, 1E) 0 0
R(1SE, 2S, 1SW, 1E) R(2SE, 1S, 2SW, 2E) Y(2SE, 1S, 2SW, 1E) 0 0 0
Y(1SE, 1S, 1SW, 1E) Y(1SE, 1S, 3SW, 2E) R(3SE, 1S, 1SW, 1E) 0 0 0
Y(1SE, 2S, 4SW, __)

NW  N  NE
  \ | /
W - X

data Memo =
  Empty |
  Red Int Int Int Int |
  Yellow Int Int Int Int

[[Memo]]

Dynamic programming reduces exponential-time problems to polynomial-time problems

O(b^n) -> O(n^p)
e.g.
O(2^n) -> O(n^3)

*/