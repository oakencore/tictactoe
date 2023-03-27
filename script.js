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
      const player1SymbolSelect = document.getElementById("player1Symbol");
      const player1Symbol = player1SymbolSelect.value;
      const player2Symbol = player1Symbol === "X" ? "O" : "X";
      const startingPlayer = this.player1;

      // Initalise the game with the selected player symbol and resets the board by calling restart method
      this.init(startingPlayer, player1Symbol, player2Symbol);
      this.restartGame();
      document.getElementById("gameBoard").style.display = "block";
      this.createGameBoard();
    });
    // Restart method called old game state is cleared if selecting new symbol.
    this.restart();
  },

  // Handle what happens when a cell is clicked
  cellClicked(event) {
    if (this.gameEnded) return;

    // Determines which row and column was clicked.
    const cell = event.target;
    const row = parseInt(cell.getAttribute("data-row"));
    const col = parseInt(cell.getAttribute("data-col"));

    // Check if cell was already occupied and return if so.
    if (this.gameBoardArray[row][col] !== "") return;

    // Update cell with current players symbol and adds 1 to movesPlayed.
    this.gameBoardArray[row][col] = this.currentPlayer.symbol;
    cell.textContent = this.currentPlayer.symbol;
    this.movesPlayed++;

    // Check to see if the player is a winner and sets gameEnded to true if so.
    // Switches turns to next player if gameEnded is not true.
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

  // CHanged this to make it feel like you're playing against an ultra difficult skynet
  computerMove() {
    if (this.gameEnded || !this.hasEmptyCells()) return;

    let bestValue = -Infinity;
    let bestMove = null;

    for (const [row, col] of this.getEmptyCells(this.gameBoardArray)) {
      const newBoard = this.copyBoard(this.gameBoardArray);
      newBoard[row][col] = this.player2.symbol;
      const value = this.minimax(newBoard, 5, false);

      if (value > bestValue) {
        bestValue = value;
        bestMove = [row, col];
      }
    }

    const [row, col] = bestMove;
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

    //Flattened. Turning the array from 2D to 1D.
    const flattenedBoard = this.gameBoardArray.flat();

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

  evaluateBoard(board) {
    const flattenedBoard = board.flat();
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

    for (const condition of winningConditions) {
      const [a, b, c] = condition;
      if (
        flattenedBoard[a] &&
        flattenedBoard[a] === flattenedBoard[b] &&
        flattenedBoard[a] === flattenedBoard[c]
      ) {
        if (flattenedBoard[a] === this.player2.symbol) {
          return 10;
        } else if (flattenedBoard[a] === this.player1.symbol) {
          return -10;
        }
      }
    }

    if (this.getEmptyCells(board).length === 0) {
      return 0; // draw
    }

    return null; // game not yet finished
  },

  minimax(board, depth, maximizingPlayer) {
    const score = this.evaluateBoard(board);

    // Base case: Return the score if the game has ended or reached the maximum depth
    if (score !== null || depth === 0) {
      return score;
    }

    let bestValue;

    if (maximizingPlayer) {
      bestValue = -Infinity;
      for (const [row, col] of this.getEmptyCells(board)) {
        const newBoard = this.copyBoard(board);
        newBoard[row][col] = this.player2.symbol;
        const value = this.minimax(newBoard, depth - 1, false);
        bestValue = Math.max(bestValue, value);
      }
    } else {
      bestValue = Infinity;
      for (const [row, col] of this.getEmptyCells(board)) {
        const newBoard = this.copyBoard(board);
        newBoard[row][col] = this.player1.symbol;
        const value = this.minimax(newBoard, depth - 1, true);
        bestValue = Math.min(bestValue, value);
      }
    }
    return bestValue;
  },

  // Returns an array of empty cell coordinates
  getEmptyCells(board) {
    const emptyCells = [];
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === "") {
          emptyCells.push([row, col]);
        }
      }
    }
    return emptyCells;
  },

  // Creates a copy of the game board
  copyBoard(board) {
    return board.map((row) => row.slice());
  },


};

ticTacToeGame.setupStartGameButton();
