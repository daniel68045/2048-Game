import Grid from "./components/grid.js";
import Tile from "./components/tile.js";

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the grid
  const gameGrid = new Grid(4);
  // Render the grid into the container with the ID "game-container"
  gameGrid.renderGrid("game-container");

  // Get the grid container
  const container = document.getElementById("game-container");

  // Add a few tiles to test the rendering
  const tile1 = new Tile(2, 0, 0); // Tile at row 0, col 0 with value 2
  const tile2 = new Tile(4, 1, 1); // Tile at row 1, col 1 with value 4
  tile1.renderTile(container);
  tile2.renderTile(container);
});
