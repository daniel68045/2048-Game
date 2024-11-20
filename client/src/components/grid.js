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
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

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
    const container = document.getElementById("game-container");

    return Array.from(container.children).find((tile) => {
      return (
        tile.classList.contains("tile") &&
        parseInt(tile.style.gridRowStart, 10) === row + 1 &&
        parseInt(tile.style.gridColumnStart, 10) === col + 1
      );
    });
  }

  renderTiles(container) {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const value = this.grid[row][col];

        if (value !== null) {
          let tile = this.getTileAt(row, col);

          if (!tile) {
            tile = document.createElement("div");
            tile.classList.add("tile");
            tile.textContent = value;
            tile.style.width = "92.5px";
            tile.style.height = "92.5px";
            tile.style.lineHeight = "92.5px";
            container.appendChild(tile);
          }

          tile.style.gridRowStart = row + 1;
          tile.style.gridColumnStart = col + 1;
        }
      }
    }
  }
}
