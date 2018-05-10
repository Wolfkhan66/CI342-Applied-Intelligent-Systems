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
    // starting tile is rounded to avoid issues when a path is calculted in the middle of the AI tween.
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

    // the following AStar implementation is adapted from pseudo code described in this article: https://www.raywenderlich.com/4946/introduction-to-a-pathfinding
    // The code has the following steps:
    // - get the tile with the lowest f Score
    // - add the tile to the closed lest and remove it from the open list
    // - check if the tile just added to the closed list is the target
    // - if it is then a path has been FOUND
    // - if its not get the tiles adjacent tiles
    // - for each adjacent tile check if its already in the closed list
    // - if it is then skip it
    // - if its not then check if its already in the open list
    // - if its not in the open list then calculate its scores and add it to the open list
    // - if it is in the open list then check to see if the path to the current tile has a better f score and if it does, update the parent
    // - repeat the above steps until a path is found or their are no more tiles to process in the open list
    this.open.push(this.currentTile);
    do {
      this.currentTile = this.getLowestFScore();
      this.closed.push(this.currentTile);
      var indexOTile = this.open.indexOf(this.currentTile);
      this.open.splice(indexOTile, 1);
      this.closed.forEach(function(tile) {
        if (tile.x == target.x && tile.y == target.y) {
          aStar.pathFound = true;
          aStar.path = tile;
        }
      });
      if (this.pathFound === true) {
        break;
      }
      var adjacentTiles = aStar.getAdjacentTiles(tilemap);
      adjacentTiles.forEach(function(tile) {
        var tileFoundInClosed = false;
        aStar.closed.forEach(function(closedTile) {
          if (closedTile.x == tile.x && closedTile.y == tile.y) {
            tileFoundInClosed = true;
          }
        });
        if (tileFoundInClosed === true) {
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
      // this should only happen if there has been an error in map generation that created an unreachable area
      console.log("Path Not Found");
    }
  }

  calculateHScore(tile, target) {
    // take the x and y of the current tile and the target tile and subtract them from one another
    // if the new x and y are negative then convert them to positive values
    // add the new x and y together to get the distance to the target which is the h score
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

    // check tiles that are within the tilemap borders
    // if those tiles are walkable or in this case a floor tile
    // add those tiles to the adjacent tiles array and return it
    if (this.currentTile.x > 0) {
      if (tilemap[this.currentTile.y][this.currentTile.x - 1] === 0) {
        tiles.push({
          x: this.currentTile.x - 1,
          y: this.currentTile.y,
          direction: "left"
        })
      }
    }
    if (this.currentTile.x < ((mapGenerator.mapWidth * gameWorld.areaSize) - 1)) {
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
    // the path returned is the target tile with the path nested in the parent tiles
    // here we go through each nested parent and create an array to log each tiles x and y
    // the reveresed array is then returned to give a path starting from the current tile to the target tile
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
