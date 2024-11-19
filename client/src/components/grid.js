export default class Grid {
  constructor(size = 4) {
    this.size = size; // The grid is a square of size x size (default: 4x4)
    this.grid = this.createGrid(); // The main grid structure (2D array)
  }

  /**
   * Create an empty 2D array for the grid.
   * Each cell will start with a `null` value.
   */
  createGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }

  /**
   * Render the grid structure in the DOM.
   * The grid container should already exist in the HTML.
   */
  renderGrid(containerId = "game-container") {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }

    // Clear any existing content in the container
    container.innerHTML = "";

    // Create grid cells dynamically
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("grid-cell"); // Apply CSS for each grid cell
        cell.setAttribute("data-row", row); // For tracking position
        cell.setAttribute("data-col", col); // For tracking position
        container.appendChild(cell);
      }
    }

    // Add styling for the grid layout dynamically
    container.style.display = "grid";
    container.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${this.size}, 1fr)`;
    container.style.gap = "10px"; // Spacing between cells
  }

  /**
   * Debug: Print the current state of the grid (2D array) to the console.
   */
  logGrid() {
    console.table(this.grid);
  }
}
