export default class Tile {
  /**
   * Initialize a new tile.
   * @param {number} value - The initial value of the tile (default: 2).
   * @param {number} row - The row position of the tile.
   * @param {number} col - The column position of the tile.
   */
  constructor(value = 2, row, col) {
    console.log(`Creating Tile - Value: ${value}, Row: ${row}, Col: ${col}`);
    this.value = value; // The value of the tile (e.g., 2, 4, 8)
    this.row = row; // The row position of the tile
    this.col = col; // The column position of the tile
    this.merged = false; // Indicates whether the tile has already merged during a turn
    this.element = null; // DOM element representing the tile
  }

  /**
   * Renders the tile on the grid.
   * @param {HTMLElement} container - The container element to render the tile in.
   */
  renderTile(container) {
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.textContent = this.value;
    // Set custom CSS variables for positioning
    this.element.style.setProperty("--row", this.row);
    this.element.style.setProperty("--col", this.col);
    this.element.classList.add(`tile-${this.value}`);
    container.appendChild(this.element);
  }

  /**
   * Updates the tile's position and DOM styles.
   * @param {number} row - The new row position.
   * @param {number} col - The new column position.
   */
  updatePosition(row, col) {
    this.row = row;
    this.col = col;

    if (this.element) {
      this.element.style.setProperty("--row", this.row);
      this.element.style.setProperty("--col", this.col);
    }
  }

  /**
   * Updates the tile's value after merging.
   * @param {number} newValue - The new value of the tile.
   */
  updateValue(newValue) {
    this.value = newValue;

    if (this.element) {
      this.element.textContent = this.value;
      this.element.className = `tile tile-${this.value}`; // Update class for styling
    }
  }

  /**
   * Marks the tile as merged for this turn.
   */
  setMerged() {
    this.merged = true;
  }

  /**
   * Resets the tile's merge status for the next turn.
   */
  resetMerged() {
    this.merged = false;
  }

  /**
   * Removes the tile from the DOM (when merging or game reset).
   */
  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
