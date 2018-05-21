class GameWorld {
  constructor() {
    console.log("Constructing Game World");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.target = null;
    this.ai = null;
    this.pathFound = false;
    this.path = [];
    this.pathTiles = [];
    this.tweenActive = false;
    this.assetGroup = game.add.group();
    this.tilemapArray = [];
    this.tileSize = 8;
    this.areaSize = 5;
  }

  update() {
    // if a target has been created, and a path to that target has not been found
    if (this.target != null && this.pathFound == false) {
      this.path = aStar.calculatePath(this.ai, this.target, this.tilemapArray);
      this.pathFound = true;
      this.showPath();
    }
    if (this.pathFound) {
      // if there is a tile left in the path and a tween is not active
      if (this.path[0] != null && !this.tweenActive) {
        // create a new tween for the ai to that tile and remove that tile from the path when the tween is complete
        this.ai.tween = game.add.tween(this.ai);
        var duration = 50;
        this.ai.tween.to({
          x: this.path[0].x * this.tileSize,
          y: this.path[0].y * this.tileSize
        }, duration);
        this.ai.tween.start();
        this.tweenActive = true;
        this.ai.tween.onComplete.add(() => {
          this.path.splice(0, 1);
          this.tweenActive = false;
        });
      }
    }
  }

  showPath() {
    this.pathTiles.forEach((tile) => {
      tile.destroy();
    });
    this.path.forEach((tile) => {
      var pathSprite = this.assetGroup.create(tile.x * gameWorld.tileSize, tile.y * gameWorld.tileSize, 'path');
      gameWorld.pathTiles.push(pathSprite)
    });
    this.ai.bringToTop();
    this.target.bringToTop();
  }

  cleanUp() {
    game.tweens.removeAll();
    this.assetGroup.destroy(true, true);
    this.target = null;
    this.ai = null;
    this.tweenActive = false;
    this.pathFound = false;
    this.path = [];
  }

  createTarget(sprite) {
    this.pathFound = false;
    if (this.target != null) {
      this.target.destroy();
    }
    this.target = this.assetGroup.create(sprite.x, sprite.y, 'target')
  }

  createMap() {
    mapGenerator.createMap();
    this.fillTilemap();
    this.createAISprite();
  }

  createAISprite() {
    // pick a random area
    // if that area is not a 16 which is blocked off, create the ai sprite.
    var x = mapGenerator.getRandomInt(0, mapGenerator.mapWidth - 1);
    var y = mapGenerator.getRandomInt(0, mapGenerator.mapHeight - 1);
    if (mapGenerator.areaMap[y][x].type != 16) {
      // if the ai sprite hasn't been made, create it.
      // else move the old sprite to a new position and bring the sprite to the top of the render order
      if (this.ai == null) {
        this.ai = this.assetGroup.create(((x * this.areaSize) * this.tileSize) + 16, ((y * this.areaSize) * this.tileSize) + 16, 'ai');
      } else {
        this.ai.x = ((x * this.areaSize) * this.tileSize);
        this.ai.y = ((y * this.areaSize) * this.tileSize);
        this.ai.bringToTop();
      }
    } else {
      this.createAISprite();
    }
  }

  fillTilemap() {
    console.log("filling tilemap");
    this.tilemapArray = [];
    var row = [];
    // prepare the tilemap array by filling it with null values
    for (var y = 0; y < mapGenerator.mapHeight * this.areaSize; y++) {
      row = [];
      for (var x = 0; x < mapGenerator.mapWidth * this.areaSize; x++) {
        row.push(null);
      }
      gameWorld.tilemapArray.push(row);
    }

    // process each area in the areamap
    for (var y = 0; y < mapGenerator.mapHeight; y++) {
      row = [];
      for (var x = 0; x < mapGenerator.mapWidth; x++) {
        var area = mapGenerator.areaMap[y][x]
        // if the area is null then replace it with the area 16 that has all tiles as walls
        if (area == null) {
          mapGenerator.areaMap[y][x] = new Area(16, this.areaSize, x, y)
          area = mapGenerator.areaMap[y][x];
        }
        // for each tile in the area tilemap
        for (var areaY = 0; areaY < area.size; areaY++) {
          for (var areaX = 0; areaX < area.size; areaX++) {
            // create a sprite in the overall tilemap for that tile.
            gameWorld.tilemapArray[(y * area.size) + areaY][(x * area.size) + areaX] = area.tilemap[areaY][areaX];
            if (area.tilemap[areaY][areaX] === 1) {
              this.createTile(((x * area.size) + areaX), ((y * area.size) + areaY), 'wall', area.tilemap[areaY][areaX], area.type);
            } else {
              this.createTile(((x * area.size) + areaX), ((y * area.size) + areaY), 'floor', area.tilemap[areaY][areaX], area.type);
            }
          }
        }
      }
    }
    this.fillTilemapBounds();
  }

  fillTilemapBounds() {
    // create wall tiles around the boundary of the tilemap to better show the height and width of the map
    for (var y = 0; y < mapGenerator.mapHeight * this.areaSize; y++) {
      for (var x = 0; x < mapGenerator.mapWidth * this.areaSize; x++) {
        if (x == 0) {
          this.createTile(x, y, 'wall', 1, null);
        }
        if (y == 0) {
          this.createTile(x, y, 'wall', 1, null);
        }
        if (x == (mapGenerator.mapWidth * this.areaSize) - 1) {
          this.createTile(x, y, 'wall', 1, null);
        }
        if (y == (mapGenerator.mapHeight * this.areaSize) - 1) {
          this.createTile(x, y, 'wall', 1, null);
        }
      }
    }

  }
  createTile(x, y, image, type, area) {
    // only create srites for tiles if they are not the area type 16
    // Note: This dramatically improves performance by not wasting memory rendering tiles for blocked off areas
    if (area != 16) {
      x = x * this.tileSize;
      y = y * this.tileSize
      var tile = this.assetGroup.create(x, y, image);
      // if the type is a floor tile, create a click event that creates the target for the ai to that tile
      if (type == 0) {
        tile.inputEnabled = true;
        tile.events.onInputUp.add(function() {
          gameWorld.createTarget(tile);
        }, this);
      }
    }
  }

}
