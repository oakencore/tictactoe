const ticTacToeGame = {
  player1: null,
  player2: null,
  currentPlayer: null,
  movesPlayed: 0,
  gameEnded: false,
  gameBoardArray: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],

  init() {
    this.player1 = this.createPlayer("Player 1", "X");
    this.player2 = this.createPlayer("Player 2", "O");
    this.currentPlayer = this.player1;
    this.createGameBoard();
  },

  // Factory function to create players
  createPlayer(name, symbol) {
    return {
      name,
      symbol,
      score: 0,
    };
  },

  // Handle cell clicks
  cellClicked(event) {
    if (this.gameEnded) return;

    const cell = event.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));

    if (this.gameBoardArray[row][col] !== "") return;

    this.gameBoardArray[row][col] = this.currentPlayer.symbol;
    cell.textContent = this.currentPlayer.symbol;
    this.movesPlayed++;

    if (this.checkWinner()) {
      alert(`${this.currentPlayer.name} wins!`);
      this.gameEnded = true;
    } else if (this.movesPlayed === 9) {
      alert("It's a draw!");
      this.gameEnded = true;
    } else {
      this.currentPlayer =
        this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
  },

  // Create the grid and cells
  createGameBoard() {
    const gameBoard = document.getElementById("gameBoard");

    for (let row = 0; row < 3; row++) {
      const rowElement = document.createElement("div");
      rowElement.classList.add("row");

      for (let col = 0; col < 3; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        cell.addEventListener("click", (event) => this.cellClicked(event));

        rowElement.appendChild(cell);
      }

      gameBoard.appendChild(rowElement);
    }
  },

  // Winning conditions for 1d grid.
  checkWinner() {
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

    const flattenedBoard = this.gameBoardArray.flat(); //Flattened turning the array from 2 to 1D.

    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        flattenedBoard[a] === this.currentPlayer.symbol &&
        flattenedBoard[a] === flattenedBoard[b] &&
        flattenedBoard[a] === flattenedBoard[c]
      ) {
        return true;
      }
    }
    return false;
  },

  restart() {
    // Event listener for restart button
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
      this.restartGame();
    });
  },

  restartGame() {
    // Clears symbols from gameboardarray
    this.gameBoardArray = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    // Change player to player1 and clear moves. 
    this.currentPlayer = this.player1;
    this.movesPlayed = 0;
    this.gameEnded = false;

    // Empty content from all cells
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.textContent = "";
    });
  },
};

// Initialise the game
ticTacToeGame.init();
ticTacToeGame.restart();
