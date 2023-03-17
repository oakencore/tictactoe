// Factory function to create new players
function createPlayer(name, symbol) {
  return {
    name,
    symbol,
    score: 0,
  };
}

const player1 = createPlayer("Player 1", "X");
const player2 = createPlayer("Player 2", "O");

let currentPlayer = player1;
let movesPlayed = 0;
let gameEnded = false;

const gameBoardArray = [
  ["", "", ""],
  ["", "", ""],
  ["", "", ""],
];

// Winning conditions for the game.
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Handle cell click event
function cellClicked(event) {
  if (gameEnded) return;

  const cell = event.target;
  const row = parseInt(cell.getAttribute("data-row"));
  const col = parseInt(cell.getAttribute("data-col"));

  if (gameBoardArray[row][col] !== "") return;

  gameBoardArray[row][col] = currentPlayer.symbol;
  cell.textContent = currentPlayer.symbol;
  movesPlayed++;

  if (checkWinner()) {
    alert(`${currentPlayer.name} wins!`);
    gameEnded = true;
  } else if (movesPlayed === 9) {
    alert("It's a draw!");
    gameEnded = true;
  } else {
    currentPlayer = currentPlayer.symbol === "X" ? player2 : player1;
  }
}

// Create the game board dynamically and add click event listeners to cells
function createGameBoard() {
  const gameBoard = document.getElementById("gameBoard");

  for (let row = 0; row < 3; row++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    for (let col = 0; col < 3; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.setAttribute("data-row", row);
      cell.setAttribute("data-col", col);
      cell.addEventListener("click", cellClicked);

      rowElement.appendChild(cell);
    }

    gameBoard.appendChild(rowElement);
  }
}

// Check if the current player has won
function checkWinner() {
  const flattenedBoard = gameBoardArray.flat();

  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (
      flattenedBoard[a] === currentPlayer.symbol &&
      flattenedBoard[a] === flattenedBoard[b] &&
      flattenedBoard[a] === flattenedBoard[c]
    ) {
      return true;
    }
  }
  return false;
}

// Call the createGameBoard function to create the grid
createGameBoard();
