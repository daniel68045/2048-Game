import Tile from "./tile.js";
export default class Grid {
  constructor(size = 4) {
    this.size = size;
    this.grid = this.createGrid(); // Grid stores Tile instances or null
  }

  // Create a 2D grid initialized with null
  createGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  // Render the grid cells and tiles
  renderGrid(containerId = "game-container") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    // Clear the container
    container.innerHTML = "";

    // Render the grid cells
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        container.appendChild(cell);
      }
    }

    // Render the tiles on the grid
    this.renderTiles(container);

    // Apply container styles
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    container.style.gap = "10px";
  }

  // Get the Tile object at a specific grid position
  getTileAt(row, col) {
    return this.grid[row][col]; // Return the Tile instance or null
  }

  // Render all tiles on the grid
  renderTiles(container) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.grid[row][col]; // Get the Tile instance

        if (tile !== null) {
          // Render or update the tile
          if (!tile.element) {
            // If the tile's DOM element does not exist, render it
            tile.renderTile(container);
          }

          // Update the tile's position and value
          tile.updatePosition(row, col);
          tile.updateValue(tile.value);
        }
      }
    }
  }
}
