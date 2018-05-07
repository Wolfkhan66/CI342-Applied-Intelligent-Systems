class GameWorld {
  constructor() {
    console.log("Constructing Game World");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.assets = [];
    this.mapHeight = 13;
    this.mapWidth = 20;
    this.areaSize = 5;
    this.areaMap = [];
    this.tilemapArray = [];
  }

  update() {

  }

  cleanUp() {
    this.assets.forEach(asset => asset.sprite.destroy());
    this.assets = [];
  }

  createTarget(sprite) {
    console.log("click");
    console.log(sprite.x, sprite.y);
    game.add.sprite(sprite.x, sprite.y, 'wall')
  }

  createMap() {
    this.prepareAreaMap();

    var minimumAreas = 10;
    var total = 0;
    var startingArea = {
      x: this.getRandomInt(1, this.mapWidth - 2),
      y: this.getRandomInt(1, this.mapHeight - 2)
    };
    this.areaMap[startingArea.y][startingArea.x] = new Area(this.getRandomInt(1, 15), this.areaSize, startingArea.x, startingArea.y);

    var mapComplete = false;
    var currentArea = this.areaMap[startingArea.y][startingArea.x];
    while (!mapComplete) {
      var adjacent = this.getAdjacent(currentArea);
      if (adjacent != null) {
        adjacent.forEach((tile) => {
          gameWorld.areaMap[tile.y][tile.x] = gameWorld.generateArea(tile);
        });
      }
      currentArea.processed = true;
      total++;
      currentArea = this.getUnprocessedArea();
      if (currentArea == null) {
        if (total < minimumAreas) {
          this.createMap();
        } else {
          mapComplete = true;
        }
      }
    }
    this.fillTilemap();
  }

  fillTilemap() {
    console.log("filling tilemap");
    this.tilemap = [];
    var row = [];
    for (var y = 0; y < this.mapHeight * this.areaSize; y++) {
      row = [];
      for (var x = 0; x < this.mapWidth * this.areaSize; x++) {
        row.push(null);
      }
      gameWorld.tilemapArray.push(row);
    }

    for (var y = 0; y < this.mapHeight; y++) {
      row = [];
      for (var x = 0; x < this.mapWidth; x++) {
        var area = this.areaMap[y][x]
        if (area == null) {
          this.areaMap[y][x] = new Area(16, this.areaSize, x, y)
          area = this.areaMap[y][x];
        }
        for (var areaY = 0; areaY < area.size; areaY++) {
          for (var areaX = 0; areaX < area.size; areaX++) {
            gameWorld.tilemapArray[(y * area.size) + areaY][(x * area.size) + areaX] = area.tilemap[areaY][areaX];
            if (area.tilemap[areaY][areaX] === 1) {
              this.assets.push(this.createTile(((x * area.size) + areaX) * 8, ((y * area.size) + areaY) * 8, 'wall', area.tilemap[areaY][areaX]));
            } else {
              this.assets.push(this.createTile(((x * area.size) + areaX) * 8, ((y * area.size) + areaY) * 8, 'floor', area.tilemap[areaY][areaX]));
            }
          }
        }
      }
    }
    console.log(this.tilemapArray);
  }

  createTile(x, y, image, type) {
    var tile = {
      id: gameWorld.assets.length,
      x: x,
      y: y,
      sprite: game.add.sprite(x, y, image),
      type,
      type
    }
    if (type == 0) {
      tile.sprite.inputEnabled = true;
      tile.sprite.events.onInputUp.add(function() {
        gameWorld.createTarget(tile);
      }, this);
    }
    return tile;
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
      var area = new Area(this.getRandomInt(1, 16), this.areaSize, tile.x, tile.y);

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
