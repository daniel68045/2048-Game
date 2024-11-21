import Grid from "../components/grid.js";
import Tile from "../components/tile.js";

export default class GameLogic {
  constructor() {
    this.grid = new Grid(4); // Initialize a 4x4 grid
    this.init();
  }

  init() {
    this.grid.renderGrid("game-container");

    const container = document.getElementById("game-container");

    this.addRandomTile(container);
    this.addRandomTile(container);

    this.setupEventListeners();

    document.getElementById("restart-button").addEventListener("click", () => {
      this.restartGame();
    });
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  handleKeyPress(event) {
    const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    if (validKeys.includes(event.key)) {
      event.preventDefault();

      let moved = false;
      switch (event.key) {
        case "ArrowUp":
          moved = this.moveUp();
          break;
        case "ArrowDown":
          moved = this.moveDown();
          break;
        case "ArrowLeft":
          moved = this.moveLeft();
          break;
        case "ArrowRight":
          moved = this.moveRight();
          break;
      }

      if (moved) {
        const container = document.getElementById("game-container");
        this.addRandomTile(container); // Add a new tile after any move or merge
        this.grid.renderTiles(container); // Re-render tiles

        if (!this.canMove()) {
          setTimeout(() => {
            this.showGameOverModal();
          }, 1000);
        }
      }
    }
  }

  showGameOverModal() {
    const modal = document.getElementById("game-over-modal");
    modal.classList.remove("hidden");
  }

  restartGame() {
    const modal = document.getElementById("game-over-modal");
    modal.classList.add("hidden");

    const container = document.getElementById("game-container");
    container.innerHTML = "";

    this.grid = new Grid(4); // Reset the grid
    this.init(); // Restart the game
  }

  // Move tiles left
  moveLeft() {
    let hasMoved = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = this.grid.grid[row].filter((tile) => tile !== null); // Remove nulls
      let newRow = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (
          i < currentRow.length - 1 &&
          currentRow[i].value === currentRow[i + 1].value
        ) {
          // Merge tiles immediately
          const mergedValue = currentRow[i].value * 2;
          currentRow[i].updateValue(mergedValue); // Update value of the first tile
          currentRow[i + 1].remove(); // Remove the second tile
          this.grid.grid[row][i + 1] = null; // Clear the merged tile from the grid
          newRow.push(currentRow[i]); // Add the updated tile to the new row
          i++; // Skip the next tile (already merged)
          hasMoved = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null); // Fill the rest with nulls
      }

      // Update the grid and animate tiles
      for (let col = 0; col < this.grid.size; col++) {
        const tile = newRow[col];
        if (tile) {
          if (tile.col !== col || tile.row !== row) {
            hasMoved = true; // Track movement
          }
          tile.updatePosition(row, col); // Trigger sliding animation
        }
        this.grid.grid[row][col] = tile; // Update the grid
      }
    }

    return hasMoved;
  }

  // Move tiles right
  moveRight() {
    let hasMoved = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = [...this.grid.grid[row]]
        .filter((tile) => tile !== null)
        .reverse(); // Reverse for rightward movement

      let newRow = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (
          i < currentRow.length - 1 &&
          currentRow[i].value === currentRow[i + 1].value
        ) {
          // Merge tiles immediately
          const mergedValue = currentRow[i].value * 2;
          currentRow[i].updateValue(mergedValue);
          currentRow[i + 1].remove(); // Remove the second tile
          this.grid.grid[row][this.grid.size - 1 - i] = null; // Clear the merged tile
          newRow.push(currentRow[i]); // Add the merged tile
          i++; // Skip the next tile (already merged)
          hasMoved = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null); // Fill with nulls
      }

      newRow.reverse(); // Reverse back to match the grid

      // Update the grid and animate tiles
      for (let col = 0; col < this.grid.size; col++) {
        const tile = newRow[col];
        if (tile) {
          if (tile.col !== col || tile.row !== row) {
            hasMoved = true; // Track movement
          }
          tile.updatePosition(row, col); // Trigger sliding animation
        }
        this.grid.grid[row][col] = tile; // Update the grid
      }
    }

    return hasMoved;
  }

  // Move tiles up
  moveUp() {
    let hasMoved = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      for (let row = 0; row < this.grid.size; row++) {
        if (this.grid.grid[row][col] !== null) {
          currentColumn.push(this.grid.grid[row][col]);
        }
      }

      let newColumn = [];

      for (let i = 0; i < currentColumn.length; i++) {
        if (
          i < currentColumn.length - 1 &&
          currentColumn[i].value === currentColumn[i + 1].value
        ) {
          // Merge tiles immediately
          const mergedValue = currentColumn[i].value * 2;
          currentColumn[i].updateValue(mergedValue);
          currentColumn[i + 1].remove(); // Remove the second tile
          this.grid.grid[i + 1][col] = null; // Clear the merged tile
          newColumn.push(currentColumn[i]); // Add the merged tile
          i++; // Skip the next tile (already merged)
          hasMoved = true;
        } else {
          newColumn.push(currentColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null); // Fill with nulls
      }

      // Update the grid and animate tiles
      for (let row = 0; row < this.grid.size; row++) {
        const tile = newColumn[row];
        if (tile) {
          if (tile.row !== row || tile.col !== col) {
            hasMoved = true; // Track movement
          }
          tile.updatePosition(row, col); // Trigger sliding animation
        }
        this.grid.grid[row][col] = tile; // Update the grid
      }
    }

    return hasMoved;
  }

  // Move tiles down
  moveDown() {
    let hasMoved = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      for (let row = 0; row < this.grid.size; row++) {
        if (this.grid.grid[row][col] !== null) {
          currentColumn.push(this.grid.grid[row][col]);
        }
      }

      currentColumn.reverse(); // Reverse for downward movement

      let newColumn = [];

      for (let i = 0; i < currentColumn.length; i++) {
        if (
          i < currentColumn.length - 1 &&
          currentColumn[i].value === currentColumn[i + 1].value
        ) {
          // Merge tiles immediately
          const mergedValue = currentColumn[i].value * 2;
          currentColumn[i].updateValue(mergedValue);
          currentColumn[i + 1].remove(); // Remove the second tile
          this.grid.grid[this.grid.size - 1 - i][col] = null; // Clear the merged tile
          newColumn.push(currentColumn[i]); // Add the merged tile
          i++; // Skip the next tile (already merged)
          hasMoved = true;
        } else {
          newColumn.push(currentColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null); // Fill with nulls
      }

      newColumn.reverse(); // Reverse back to match the grid

      // Update the grid and animate tiles
      for (let row = 0; row < this.grid.size; row++) {
        const tile = newColumn[row];
        if (tile) {
          if (tile.row !== row || tile.col !== col) {
            hasMoved = true; // Track movement
          }
          tile.updatePosition(row, col); // Trigger sliding animation
        }
        this.grid.grid[row][col] = tile; // Update the grid
      }
    }

    return hasMoved;
  }

  // Check if the player can move
  canMove() {
    for (let row = 0; row < this.grid.size; row++) {
      for (let col = 0; col < this.grid.size; col++) {
        const tile = this.grid.grid[row][col];

        if (tile === null) return true; // Empty space exists

        if (
          col < this.grid.size - 1 &&
          this.grid.grid[row][col + 1] &&
          tile.value === this.grid.grid[row][col + 1].value
        ) {
          return true;
        }

        if (
          row < this.grid.size - 1 &&
          this.grid.grid[row + 1][col] &&
          tile.value === this.grid.grid[row + 1][col].value
        ) {
          return true;
        }
      }
    }
    return false;
  }

  // Add a random tile to the grid
  addRandomTile(container) {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells[randomIndex];
      const value = Math.random() < 0.7 ? 2 : 4;

      const tile = new Tile(value, cell.row, cell.col);
      this.grid.grid[cell.row][cell.col] = tile; // Add the Tile instance to the grid
      tile.renderTile(container); // Render the tile to the DOM
    }
  }

  // Find empty cells in the grid
  getEmptyCells() {
    let emptyCells = [];
    for (let row = 0; row < this.grid.size; row++) {
      for (let col = 0; col < this.grid.size; col++) {
        if (this.grid.grid[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }
    return emptyCells;
  }
}
