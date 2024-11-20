import Grid from "../components/grid.js";
import Tile from "../components/tile.js";
export default class GameLogic {
  constructor() {
    this.grid = new Grid(4);
    this.init();
  }

  init() {
    // Render the grid into the container with the ID "game-container"
    this.grid.renderGrid("game-container");

    // Get the grid container
    const container = document.getElementById("game-container");

    console.log("Initial grid state:");
    this.grid.logGrid();
    // Add a few tiles to test the rendering
    // const tile1 = new Tile(2, 0, 0); // Tile at row 0, col 0 with value 2
    // const tile2 = new Tile(4, 1, 1); // Tile at row 1, col 1 with value 4
    // const tile3 = new Tile(8, 0, 2);
    // tile1.renderTile(container);
    // tile2.renderTile(container);
    // tile3.renderTile(container);

    // Add random tile
    this.addRandomTile(container);
    this.addRandomTile(container);

    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener("keydown", (event) => this.handleKeyPress(event));
  }

  handleKeyPress(event) {
    // List of valid keys that should trigger grid actions
    const validKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

    // Check if the pressed key is one of the valid keys
    if (validKeys.includes(event.key)) {
      event.preventDefault(); // Prevent the default arrow key actions (like scrolling)

      switch (event.key) {
        case "ArrowUp":
          this.moveUp();
          break;
        case "ArrowDown":
          this.moveDown();
          break;
        case "ArrowLeft":
          this.moveLeft();
          break;
        case "ArrowRight":
          this.moveRight();
          break;
      }

      // Only add a random tile and re-render if an arrow key was pressed
      this.addRandomTile();
      this.grid.renderGrid("game-container");
    }
  }

  moveLeft() {
    let hasChanged = false; // This flag checks if any tile was moved or merged

    for (let row = 0; row < this.grid.size; row++) {
      let currentRow = this.grid.grid[row].filter((val) => val != null); // Consolidate non-null values to the left
      let newRow = [];

      // Merge tiles
      for (let i = 0; i < currentRow.length; i++) {
        if (i < currentRow.length - 1 && currentRow[i] === currentRow[i + 1]) {
          newRow.push(currentRow[i] * 2); // Merge tiles
          i++; // Skip the next tile since it has been merged
          hasChanged = true; // Indicates a change has occurred
        } else {
          newRow.push(currentRow[i]);
        }
      }

      // Fill the rest of the row with nulls
      while (newRow.length < this.grid.size) {
        newRow.push(null);
      }

      // Check if new row is different from the current row
      if (!this.grid.grid[row].every((val, index) => val === newRow[index])) {
        hasChanged = true;
        this.grid.grid[row] = newRow; // Update the row with new values
      }

      console.log(`Row ${row} after move:`, newRow); // Debugging log
    }

    if (hasChanged) {
      this.addRandomTile();
      console.log("Grid state after moving left and adding a tile:");
      this.grid.logGrid(); // Debugging log
    }

    return hasChanged; // Return whether any change has occurred
  }

  addRandomTile() {
    const container = document.getElementById("game-container");
    let emptyCells = this.getEmptyCells();
    console.log("Empty cells available:", emptyCells); // Log empty cells before adding a tile

    if (emptyCells.length > 0) {
      let randomIndex = Math.floor(Math.random() * emptyCells.length);
      let cell = emptyCells[randomIndex];
      let value = Math.random() < 0.9 ? 2 : 4; // 90% chance for '2', 10% for '4'
      this.grid.grid[cell.row][cell.col] = value; // Place the value in the grid
      console.log(`Adding tile with value ${value} at position:`, cell); // Log the tile addition

      const tile = new Tile(value, cell.row, cell.col);
      tile.renderTile(container); // Render the tile in the container

      console.log("Grid state after adding a tile:");
      this.grid.logGrid();
    }
  }

  getEmptyCells() {
    let emptyCells = [];
    // Correct access to the size property of the Grid instance
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
