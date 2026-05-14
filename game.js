const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const cells   = document.querySelectorAll('.cell');
const status  = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const xWinsEl = document.getElementById('x-wins');
const oWinsEl = document.getElementById('o-wins');
const drawsEl = document.getElementById('draws');

let board        = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver     = false;
let scores       = { X: 0, O: 0, draws: 0 };

function checkWinner(b) {
  for (const [a, c, d] of WINNING_LINES) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) {
      return { winner: b[a], line: [a, c, d] };
    }
  }
  if (b.every(Boolean)) return { winner: null, line: null, draw: true };
  return null;
}

function handleClick(e) {
  const idx = parseInt(e.currentTarget.dataset.index, 10);
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  const cell = e.currentTarget;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;

  const result = checkWinner(board);

  if (result) {
    gameOver = true;
    if (result.draw) {
      status.textContent = "It's a draw!";
      status.className = 'status draw';
      scores.draws++;
      drawsEl.textContent = scores.draws;
    } else {
      status.textContent = `Player ${result.winner} wins!`;
      status.className = 'status win';
      scores[result.winner]++;
      xWinsEl.textContent = scores.X;
      oWinsEl.textContent = scores.O;
      result.line.forEach(i => cells[i].classList.add('winning'));
    }
    cells.forEach(c => c.disabled = true);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Player ${currentPlayer}'s turn`;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  status.textContent = "Player X's turn";
  status.className = 'status';
  cells.forEach(cell => {
    cell.textContent = '';
    cell.className = 'cell';
    cell.disabled = false;
  });
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetBtn.addEventListener('click', resetGame);
