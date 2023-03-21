const ticTacToeGame = {
  // Not all of these are used yet.
  player1: { name: "Player 1", symbol: "X", score: 0 },
  player2: { name: "Player 2", symbol: "O", score: 0 },
  currentPlayer: null,
  movesPlayed: 0,
  gameEnded: false,
  gameBoardArray: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],

  init(startingPlayer, player1Symbol, player2Symbol) {
    this.player1.symbol = player1Symbol;
    this.player2.symbol = player2Symbol;
    this.currentPlayer = startingPlayer;
  },

  //Sets up event listener for the start game button.
  setupStartGameButton() {
    const startGameButton = document.getElementById("startGame");
    startGameButton.addEventListener("click", () => {
      const playerSelection = document.getElementById("playerSelection");
      const selectedPlayer = playerSelection.value;

      const player1SymbolSelect = document.getElementById("player1Symbol");
      const player1Symbol = player1SymbolSelect.value;
      const player2Symbol = player1Symbol === "X" ? "O" : "X";

      const startingPlayer =
        selectedPlayer === "player1" ? this.player1 : this.player2;
      this.init(startingPlayer, player1Symbol, player2Symbol);

      this.restartGame();
      document.getElementById("gameBoard").style.display = "block";
      this.createGameBoard();
    });

    this.restart();
  },

  // Handle what happens when a cell is clicked
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
      this.switchPlayer();
      this.computerMove();
    }
  },

  computerMove() {
    if (this.gameEnded || !this.hasEmptyCells()) return;

    let row, col;
    do {
      row = Math.floor(Math.random() * 3);
      col = Math.floor(Math.random() * 3);
    } while (this.gameBoardArray[row][col] !== "");

    this.gameBoardArray[row][col] = this.currentPlayer.symbol;

    const cell = document.querySelector(
      `.cell[data-row="${row}"][data-col="${col}"]`
    );
    cell.textContent = this.currentPlayer.symbol;

    this.movesPlayed++;

    if (this.checkWinner()) {
      alert(`${this.currentPlayer.name} wins!`);
      this.gameEnded = true;
    } else if (this.movesPlayed === 9) {
      alert("It's a draw!");
      this.gameEnded = true;
    } else {
      this.switchPlayer();
    }
  },

  // Factory function to create players
  createPlayer(name, symbol) {
    return {
      name,
      symbol,
      score: 0,
    };
  },

  // Create the grid and cells
  createGameBoard() {
    // Clear any existing grid if a game was ongoing.
    const gameBoard = document.getElementById("gameBoard");
    gameBoard.innerHTML = "";

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
    // Event listener for restart button that calls restartGame() when pressed.
    const restartButton = document.getElementById("restartButton");
    restartButton.addEventListener("click", () => {
      this.restartGame();
    });
  },

  // Clears symbols from gameboardarray
  restartGame() {
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

  hasEmptyCells() {
    return this.gameBoardArray.some((row) => row.some((cell) => cell === ""));
  },

  switchPlayer() {
    this.currentPlayer =
      this.currentPlayer === this.player1 ? this.player2 : this.player1;
  },
};

ticTacToeGame.setupStartGameButton();
