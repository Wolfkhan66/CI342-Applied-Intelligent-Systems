class AStar {
  constructor() {
    this.open = [];
    this.closed = [];
    this.pathFound = false;
    this.path = null;
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

  calculatePath(startingTile, targetTile, tilemap) {
    this.reset();
    var start = {
      x: Math.round(startingTile.x / gameWorld.tileSize),
      y: Math.round(startingTile.y / gameWorld.tileSize)
    }
    var target = {
      x: targetTile.x / gameWorld.tileSize,
      y: targetTile.y / gameWorld.tileSize
    }

    this.currentTile.x = start.x;
    this.currentTile.y = start.y;
    this.currentTile.g = 0;
    this.currentTile.h = this.calculateHScore(start, target);
    this.currentTile.f = this.currentTile.g + this.currentTile.h;

    this.open.push(this.currentTile);
    do {
      this.currentTile = this.getLowestFScore();
      this.closed.push(this.currentTile); // add the current square to the closed list
      var indexOTile = this.open.indexOf(this.currentTile);
      this.open.splice(indexOTile, 1); // remove it from the open list
      this.closed.forEach(function(tile) { // if we added the destination to the closed list, we've found a path
        if (tile.x == target.x && tile.y == target.y) { // PATH FOUND
          aStar.pathFound = true;
          aStar.path = tile;
        }
      });
      if (this.pathFound === true) { // break the loop
        break;
      }
      var adjacentTiles = aStar.getAdjacentTiles(tilemap); // Retrieve all its walkable adjacent tiles
      adjacentTiles.forEach(function(tile) {
        var tileFoundInClosed = false;
        aStar.closed.forEach(function(closedTile) {
          if (closedTile.x == tile.x && closedTile.y == tile.y) {
            tileFoundInClosed = true;
          }
        });
        if (tileFoundInClosed === true) { // skip the tile
          return;
        }

        var tileFoundInOpen = false;
        aStar.open.forEach(function(openTile) {
          if (openTile.x == tile.x && openTile.y == tile.y) {
            tileFoundInOpen = true;
          }
        });

        if (!tileFoundInOpen) {
          aStar.open.push({
            x: tile.x,
            y: tile.y,
            f: (aStar.currentTile.g + 1) + aStar.calculateHScore(tile, target),
            g: aStar.currentTile.g + 1,
            h: aStar.calculateHScore(tile, target),
            direction: tile.direction,
            parent: aStar.currentTile
          })
        } else {
          aStar.open.forEach(function(openTile) {
            if (openTile.x == tile.x && openTile.y == tile.y) {
              if (openTile.f > ((aStar.currentTile.g + 1) + aStar.calculateHScore(tile, target))) {
                openTile.parent = aStar.currentTile;
              }
            }
          });
        }
      });
    } while (this.open.length > 0);
    if (this.path != null) {
      return aStar.processPath(this.path);
    } else {
      console.log("Path Not Found");
    }
  }

  calculateHScore(tile, target) {
    var x = tile.x - target.x;
    var y = tile.y - target.y;
    if (x < 0) {
      x = x - (x * 2)
    }
    if (y < 0) {
      y = y - (y * 2);
    }
    return x + y;
  }

  getLowestFScore() {
    var lowestScore = 999999;
    var bestTile;
    this.open.forEach(function(tile) {
      if (tile.f < lowestScore) {
        lowestScore = tile.f;
        bestTile = tile;
      }
    });
    return bestTile;
  }

  getAdjacentTiles(tilemap) {
    var tiles = [];

    if (this.currentTile.x > 0) {
      if (tilemap[this.currentTile.y][this.currentTile.x - 1] === 0) {
        tiles.push({
          x: this.currentTile.x - 1,
          y: this.currentTile.y,
          direction: "left"
        })
      }
    }
    if (this.currentTile.x < ((mapGenerator.mapWidth * gameWorld.areaSize) -1)) {
      if (tilemap[this.currentTile.y][this.currentTile.x + 1] === 0) {
        tiles.push({
          x: this.currentTile.x + 1,
          y: this.currentTile.y,
          direction: "right"
        })
      }
    }
    if (this.currentTile.y > 0) {
      if (tilemap[this.currentTile.y - 1][this.currentTile.x] === 0) {
        tiles.push({
          x: this.currentTile.x,
          y: this.currentTile.y - 1,
          direction: "up"
        })
      }
    }
    if (this.currentTile.y < ((mapGenerator.mapHeight * gameWorld.areaSize) - 1)) {
      if (tilemap[this.currentTile.y + 1][this.currentTile.x] === 0) {
        tiles.push({
          x: this.currentTile.x,
          y: this.currentTile.y + 1,
          direction: "down"
        })
      }
    }
    return tiles;
  }

  processPath(path) {
    var processedPath = [];
    var child = path;
    var gScore = child.g;
    var parent = child.parent;
    processedPath.push({
      x: child.x,
      y: child.y
    });

    while (gScore != 0 && child != null) {
      child = parent;
      parent = child.parent;
      if (child.direction != "") {
        processedPath.push({
          x: child.x,
          y: child.y
        });
      }
      gScore = child.g;
    }
    return processedPath.reverse();
  }

  reset() {
    this.open = [];
    this.closed = [];
    this.pathFound = false;
    this.path = null;
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
}
