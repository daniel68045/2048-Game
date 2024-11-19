import Grid from "./components/grid.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize a 4x4 grid
  const gameGrid = new Grid(4);

  // Render the grid into the container with ID "game-container"
  gameGrid.renderGrid("game-container");

  // Optional: Log the empty grid to the console for debugging
  gameGrid.logGrid();
});
