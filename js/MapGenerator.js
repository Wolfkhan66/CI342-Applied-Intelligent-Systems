class MapGenerator {
  constructor() {
    this.mapHeight = 10;
    this.mapWidth = 10;
    this.areaMap = [];
    this.minimumAreas = 10;
  }

  createMap() {
    if (this.minimumAreas > (this.mapWidth * this.mapHeight)) {
      this.minimumAreas = (this.mapWidth * this.mapHeight) / 2;
      ui.setText("minimumText", mapGenerator.minimumAreas);
    }
    this.prepareAreaMap();
    var total = 0;
    var startingArea = {
      x: this.getRandomInt(1, this.mapWidth - 2),
      y: this.getRandomInt(1, this.mapHeight - 2)
    };
    this.areaMap[startingArea.y][startingArea.x] = new Area(this.getRandomInt(1, 15), gameWorld.areaSize, startingArea.x, startingArea.y);

    var mapComplete = false;
    var currentArea = this.areaMap[startingArea.y][startingArea.x];
    while (!mapComplete) {
      if (currentArea != null) {
        var adjacent = this.getAdjacent(currentArea);
        if (adjacent != null) {
          adjacent.forEach((tile) => {
            mapGenerator.areaMap[tile.y][tile.x] = mapGenerator.generateArea(tile);
          });
        }
        currentArea.processed = true;
        total++;
        currentArea = this.getUnprocessedArea();
      } else {
        if (total < this.minimumAreas) {
          this.replaceProcessedArea();
          currentArea = this.getUnprocessedArea();
          total--;
        } else {
          mapComplete = true;
        }
      }
    }
  }

  replaceProcessedArea() {
    var areaReplaced = false;
    loop1:
      for (var y = 0; y < this.mapHeight; y++) {
        loop2: for (var x = 0; x < this.mapWidth; x++) {
          if (this.areaMap[y][x] != null) {
            var exits = this.areaMap[y][x].exits;
            if (exits.length < 4) {
              if (this.areaMap[y][x].y > 0) {
                if (!exits.includes("up")) {
                  if (this.areaMap[y - 1][x] == null) {
                    this.areaMap[y][x] = this.switchAreaType(this.areaMap[y][x], "up");
                    areaReplaced = true;
                    break loop2;
                  }
                }
              }
              if (this.areaMap[y][x].y < (mapGenerator.mapHeight - 1)) {
                if (!exits.includes("down")) {
                  if (this.areaMap[y + 1][x] == null) {
                    this.areaMap[y][x] = this.switchAreaType(this.areaMap[y][x], "down");
                    areaReplaced = true;
                    break loop2;
                  }
                }
              }
              if (this.areaMap[y][x].x > 0) {
                if (!exits.includes("left")) {
                  if (this.areaMap[y][x - 1] == null) {
                    this.areaMap[y][x] = this.switchAreaType(this.areaMap[y][x], "left");
                    areaReplaced = true;
                    break loop2;
                  }
                }
              }
              if (this.areaMap[y][x].x < (mapGenerator.mapWidth - 1)) {
                if (!exits.includes("right")) {
                  if (this.areaMap[y][x + 1] == null) {
                    this.areaMap[y][x] = this.switchAreaType(this.areaMap[y][x], "right");
                    areaReplaced = true;
                    break loop2;
                  }
                }
              }
            }
          }
        }
        if (areaReplaced == true) {
          break loop1;
        }
      }
  }

  switchAreaType(area, direction) {
    var exitsInNewArea = true;
    var newArea;
    loop:
      for (var i = 1; i < 16; i++) {
        newArea = new Area(i, gameWorld.areaSize, area.x, area.y);
        if (newArea.exits.includes(direction)) {
          area.exits.forEach((exit) => {
            if (!newArea.exits.includes(exit)) {
              exitsInNewArea = false;
            }
          });
        } else {
          exitsInNewArea = false;
        }
        if (exitsInNewArea) {
          break loop;
        }
      }
    return newArea;
  }

  prepareAreaMap() {
    this.areaMap = [];
    var row = [];
    for (var y = 0; y < this.mapHeight; y++) {
      row = [];
      for (var x = 0; x < this.mapWidth; x++) {
        row.push(null);
      }
      this.areaMap.push(row);
    }
  }

  getUnprocessedArea() {
    var area = null;
    for (var y = 0; y < this.mapHeight; y++) {
      for (var x = 0; x < this.mapWidth; x++) {
        if (this.areaMap[y][x] != null) {
          if (!this.areaMap[y][x].processed) {
            area = this.areaMap[y][x];
          }
        }
      }
    }
    return area;
  }

  generateArea(tile) {
    var areaFound = false;

    while (!areaFound) {
      var area = new Area(this.getRandomInt(1, 16), gameWorld.areaSize, tile.x, tile.y);

      switch (tile.direction) {
        case "up":
          area.exits.forEach((direction) => {
            if (direction == "down") {
              areaFound = true;
            }
          });
          break;
        case "down":
          area.exits.forEach((direction) => {
            if (direction == "up") {
              areaFound = true;
            }
          });
          break;
        case "left":
          area.exits.forEach((direction) => {
            if (direction == "right") {
              areaFound = true;
            }
          });
          break;
        case "right":
          area.exits.forEach((direction) => {
            if (direction == "left") {
              areaFound = true;
            }
          });
          break;
        default:
      }
    }
    return area;
  }

  getAdjacent(area) {
    var adjacent = [];
    if (area != null) {
      area.exits.forEach((direction) => {
        var tile = {
          x: 0,
          y: 0,
          direction: ""
        }
        switch (direction) {
          case "up":
            tile.x = area.x;
            tile.y = area.y - 1;
            tile.direction = direction;
            break;
          case "down":
            tile.x = area.x;
            tile.y = area.y + 1;
            tile.direction = direction;
            break;
          case "left":
            tile.x = area.x - 1;
            tile.y = area.y;
            tile.direction = direction;
            break;
          case "right":
            tile.x = area.x + 1;
            tile.y = area.y;
            tile.direction = direction;
            break;
          default:

        }
        // if the tile is within the array bounds.
        if (tile.x >= 0 && tile.x < this.mapWidth && tile.y >= 0 && tile.y < this.mapHeight) {
          if (this.areaMap[tile.y][tile.x] == null) {
            adjacent.push(tile);
          }
        }
      });
      return adjacent;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
