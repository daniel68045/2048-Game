import Grid from "../components/grid.js";
import Tile from "../components/tile.js";

export default class GameLogic {
  constructor() {
    this.grid = new Grid(4);
    this.inputLocked = false;
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

    if (this.inputLocked) return;

    if (validKeys.includes(event.key)) {
      event.preventDefault();

      this.inputLocked = true;
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
        this.addRandomTile(container);
        this.grid.renderTiles(container);

        setTimeout(() => {
          if (!this.canMove()) {
            this.showGameOverModal();
          }
          this.inputLocked = false;
        }, 100);
      } else {
        this.inputLocked = false;
      }
    }
  }

  showGameOverModal() {
    const modal = document.getElementById("game-over-modal");
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.add("show");
    }, 800);
  }

  restartGame() {
    const modal = document.getElementById("game-over-modal");
    modal.classList.add("hidden");

    const container = document.getElementById("game-container");
    container.innerHTML = "";

    this.grid = new Grid(4);
    this.inputLocked = false;
    this.init();
  }

  moveLeft() {
    let hasMoved = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = this.grid.grid[row].filter((tile) => tile !== null);
      let newRow = [];
      let mergeQueue = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (
          i < currentRow.length - 1 &&
          currentRow[i].value === currentRow[i + 1].value
        ) {
          const mergedValue = currentRow[i].value * 2;
          mergeQueue.push({
            target: currentRow[i],
            source: currentRow[i + 1],
            newValue: mergedValue,
          });
          newRow.push(currentRow[i]);
          i++;
          hasMoved = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null);
      }

      for (let col = 0; col < this.grid.size; col++) {
        const tile = newRow[col];
        if (tile) {
          if (tile.col !== col || tile.row !== row) {
            hasMoved = true;
          }
          tile.updatePosition(row, col);
        }
        this.grid.grid[row][col] = tile;
      }

      setTimeout(() => {
        mergeQueue.forEach(({ target, source, newValue }) => {
          source.updatePosition(target.row, target.col);
          setTimeout(() => {
            target.updateValue(newValue);
            source.remove();
          }, 200);
        });
      }, 0);
    }

    return hasMoved;
  }

  moveRight() {
    let hasMoved = false;

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = [...this.grid.grid[row]]
        .filter((tile) => tile !== null)
        .reverse();

      let newRow = [];
      let mergeQueue = [];

      for (let i = 0; i < currentRow.length; i++) {
        if (
          i < currentRow.length - 1 &&
          currentRow[i].value === currentRow[i + 1].value
        ) {
          const mergedValue = currentRow[i].value * 2;
          mergeQueue.push({
            target: currentRow[i],
            source: currentRow[i + 1],
            newValue: mergedValue,
          });
          newRow.push(currentRow[i]);
          i++;
          hasMoved = true;
        } else {
          newRow.push(currentRow[i]);
        }
      }

      while (newRow.length < this.grid.size) {
        newRow.push(null);
      }

      newRow.reverse();

      for (let col = 0; col < this.grid.size; col++) {
        const tile = newRow[col];
        if (tile) {
          if (tile.col !== col || tile.row !== row) {
            hasMoved = true;
          }
          tile.updatePosition(row, col);
        }
        this.grid.grid[row][col] = tile;
      }
      setTimeout(() => {
        mergeQueue.forEach(({ target, source, newValue }) => {
          source.updatePosition(target.row, target.col);
          setTimeout(() => {
            target.updateValue(newValue);
            source.remove();
          }, 200);
        });
      }, 0);
    }

    return hasMoved;
  }

  moveUp() {
    let hasMoved = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      let mergeQueue = [];

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
          const mergedValue = currentColumn[i].value * 2;
          mergeQueue.push({
            target: currentColumn[i],
            source: currentColumn[i + 1],
            newValue: mergedValue,
          });
          newColumn.push(currentColumn[i]);
          i++;
          hasMoved = true;
        } else {
          newColumn.push(currentColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null);
      }

      for (let row = 0; row < this.grid.size; row++) {
        const tile = newColumn[row];
        if (tile) {
          if (tile.row !== row || tile.col !== col) {
            hasMoved = true;
          }
          tile.updatePosition(row, col);
        }
        this.grid.grid[row][col] = tile;
      }

      setTimeout(() => {
        mergeQueue.forEach(({ target, source, newValue }) => {
          source.updatePosition(target.row, target.col);
          setTimeout(() => {
            target.updateValue(newValue);
            source.remove();
          }, 200);
        });
      }, 0);
    }

    return hasMoved;
  }

  moveDown() {
    let hasMoved = false;

    for (let col = 0; col < this.grid.size; col++) {
      let currentColumn = [];
      let mergeQueue = [];

      for (let row = 0; row < this.grid.size; row++) {
        if (this.grid.grid[row][col] !== null) {
          currentColumn.push(this.grid.grid[row][col]);
        }
      }

      currentColumn.reverse();

      let newColumn = [];

      for (let i = 0; i < currentColumn.length; i++) {
        if (
          i < currentColumn.length - 1 &&
          currentColumn[i].value === currentColumn[i + 1].value
        ) {
          const mergedValue = currentColumn[i].value * 2;
          mergeQueue.push({
            target: currentColumn[i],
            source: currentColumn[i + 1],
            newValue: mergedValue,
          });
          newColumn.push(currentColumn[i]);
          i++;
          hasMoved = true;
        } else {
          newColumn.push(currentColumn[i]);
        }
      }

      while (newColumn.length < this.grid.size) {
        newColumn.push(null);
      }

      newColumn.reverse();

      for (let row = 0; row < this.grid.size; row++) {
        const tile = newColumn[row];
        if (tile) {
          if (tile.row !== row || tile.col !== col) {
            hasMoved = true;
          }
          tile.updatePosition(row, col);
        }
        this.grid.grid[row][col] = tile;
      }

      setTimeout(() => {
        mergeQueue.forEach(({ target, source, newValue }) => {
          source.updatePosition(target.row, target.col);
          setTimeout(() => {
            target.updateValue(newValue);
            source.remove();
          }, 200);
        });
      }, 0);
    }

    return hasMoved;
  }

  canMove() {
    for (let row = 0; row < this.grid.size; row++) {
      for (let col = 0; col < this.grid.size; col++) {
        const tile = this.grid.grid[row][col];

        if (tile === null) return true;

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

  addRandomTile(container) {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells[randomIndex];
      const value = Math.random() < 0.7 ? 2 : 4;

      const tile = new Tile(value, cell.row, cell.col);
      this.grid.grid[cell.row][cell.col] = tile;
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
