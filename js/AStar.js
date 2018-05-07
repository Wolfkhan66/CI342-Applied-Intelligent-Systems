class AStar {
  constructor() {
    this.open = [];
    this.closed = [];
    this.pathFound = false;
    this.path = {};
    this.currentTile = {
      x: 0,
      y: 0,
      f: 0, // overall Score g + h
      g: 0, // distance from starting tile
      h: 0, // distance to target
      direction: "",
      parent: {}
    };
  }

  calculatePath(startingTile, targetTile) {

  }

  calculateHScore() {

  }

  getLowestFScore() {

  }

  getAdjacentTiles() {

  }
}
