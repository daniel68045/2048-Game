export default class Tile {
  constructor(value = 2, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.merged = false;
    this.element = null;
  }

  renderTile(container) {
    this.element = document.createElement("div");
    this.element.classList.add("tile");
    this.element.textContent = this.value;
    this.element.style.setProperty("--row", this.row);
    this.element.style.setProperty("--col", this.col);
    this.element.classList.add(`tile-${this.value}`);
    container.appendChild(this.element);
  }

  updatePosition(row, col) {
    this.row = row;
    this.col = col;

    if (this.element) {
      this.element.style.setProperty("--row", this.row);
      this.element.style.setProperty("--col", this.col);
    }
  }

  updateValue(newValue) {
    this.value = newValue;

    if (this.element) {
      this.element.textContent = this.value;

      this.element.classList.add("tile-merged");
      setTimeout(() => this.element.classList.remove("tile-merged"), 200);
    }
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
