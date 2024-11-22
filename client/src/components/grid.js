import Tile from "./tile.js";
export default class Grid {
  constructor(size = 4) {
    this.size = size;
    this.grid = this.createGrid();
  }

  createGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  renderGrid(containerId = "game-container") {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell");
        cell.setAttribute("data-row", row);
        cell.setAttribute("data-col", col);
        container.appendChild(cell);
      }
    }

    this.renderTiles(container);

    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    container.style.gap = "10px";
  }

  getTileAt(row, col) {
    return this.grid[row][col];
  }

  renderTiles(container) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const tile = this.grid[row][col];

        if (tile !== null) {
          if (!tile.element) {
            tile.renderTile(container);
          }

          tile.updatePosition(row, col);
          tile.updateValue(tile.value);
        }
      }
    }
  }
}
