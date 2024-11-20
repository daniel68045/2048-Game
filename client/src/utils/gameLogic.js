import Grid from "../components/grid.js";
import Tile from "../components/tile.js";
export default class GameLogic {
  constructor() {
    this.grid = new Grid(4);
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
        this.addRandomTile();
        this.grid.renderGrid();

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

    this.grid = new Grid(4);
    this.init();
  }

  moveLeft() {
    let hasChanged = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = this.grid.grid[row].filter((val) => val != null);
      let newRow = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (i < currentRow.length - 1 && currentRow[i] === currentRow[i + 1]) {
          newRow.push(currentRow[i] * 2);
          i++;
          hasChanged = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null);
      }

      if (!this.grid.grid[row].every((val, index) => val === newRow[index])) {
        hasChanged = true;
        this.grid.grid[row] = newRow;
      }
    }

    return hasChanged;
  }

  moveRight() {
    let hasChanged = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = [...this.grid.grid[row]]
        .reverse()
        .filter((val) => val != null);
      let newRow = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (i < currentRow.length - 1 && currentRow[i] === currentRow[i + 1]) {
          newRow.push(currentRow[i] * 2);
          i++;
          hasChanged = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null);
      }

      newRow.reverse();

      if (!this.grid.grid[row].every((val, index) => val === newRow[index])) {
        hasChanged = true;
        this.grid.grid[row] = newRow;
      }
    }

    return hasChanged;
  }

  moveUp() {
    let hasChanged = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      for (let row = 0; row < this.grid.size; row++) {
        currentColumn.push(this.grid.grid[row][col]);
      }

      let filteredColumn = currentColumn.filter((val) => val != null);
      let newColumn = [];

      for (let i = 0; i < filteredColumn.length; i++) {
        if (
          i < filteredColumn.length - 1 &&
          filteredColumn[i] === filteredColumn[i + 1]
        ) {
          newColumn.push(filteredColumn[i] * 2);
          i++;
          hasChanged = true;
        } else {
          newColumn.push(filteredColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null);
      }

      for (let row = 0; row < this.grid.size; row++) {
        if (this.grid.grid[row][col] !== newColumn[row]) {
          hasChanged = true;
          this.grid.grid[row][col] = newColumn[row];
        }
      }
    }

    return hasChanged;
  }

  moveDown() {
    let hasChanged = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      for (let row = 0; row < this.grid.size; row++) {
        currentColumn.push(this.grid.grid[row][col]);
      }

      currentColumn.reverse();

      let filteredColumn = currentColumn.filter((val) => val != null);
      let newColumn = [];

      for (let i = 0; i < filteredColumn.length; i++) {
        if (
          i < filteredColumn.length - 1 &&
          filteredColumn[i] === filteredColumn[i + 1]
        ) {
          newColumn.push(filteredColumn[i] * 2);
          i++;
          hasChanged = true;
        } else {
          newColumn.push(filteredColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null);
      }

      newColumn.reverse();

      for (let row = 0; row < this.grid.size; row++) {
        if (this.grid.grid[row][col] !== newColumn[row]) {
          hasChanged = true;
          this.grid.grid[row][col] = newColumn[row];
        }
      }
    }

    return hasChanged;
  }

  canMove() {
    for (let row = 0; row < this.grid.size; row++) {
      for (let col = 0; col < this.grid.size; col++) {
        const value = this.grid.grid[row][col];

        if (value === null) return true;

        if (
          col < this.grid.size - 1 &&
          value === this.grid.grid[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.grid.size - 1 &&
          value === this.grid.grid[row + 1][col]
        ) {
          return true;
        }
      }
    }
    return false;
  }

  addRandomTile() {
    const container = document.getElementById("game-container");
    let emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptyCells.length);
      let cell = emptyCells[randomIndex];
      let value = Math.random() < 0.7 ? 2 : 4;
      this.grid.grid[cell.row][cell.col] = value;

      const tile = new Tile(value, cell.row, cell.col);
      tile.renderTile(container);
    }
  }

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
