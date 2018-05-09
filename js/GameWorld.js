class GameWorld {
  constructor() {
    console.log("Constructing Game World");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.target = null;
    this.ai = null;
    this.pathFound = false;
    this.path = [];
    this.tweenActive = false;
    this.assetGroup = game.add.group();
    this.tilemapArray = [];
    this.tileSize = 8;
    this.areaSize = 5;
  }

  update() {
    if (this.target != null && this.pathFound == false) {
      this.path = aStar.calculatePath(this.ai, this.target, this.tilemapArray);
      this.pathFound = true;
    }
    if (this.pathFound) {
      if (this.path[0] != null && !this.tweenActive) {
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
    var x = mapGenerator.getRandomInt(0, mapGenerator.mapWidth - 1);
    var y = mapGenerator.getRandomInt(0, mapGenerator.mapHeight - 1);
    if (mapGenerator.areaMap[y][x].type != 16) {
      if (this.ai == null) {
        this.ai = this.assetGroup.create(((x * this.areaSize) * this.tileSize) + 16, ((y * this.areaSize) * this.tileSize) + 16, 'ai');
      } else {
        this.ai.x = ((x * this.areaSize) * this.tileSize) + 16;
        this.ai.y = ((y * this.areaSize) * this.tileSize) + 16;
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
    for (var y = 0; y < mapGenerator.mapHeight * this.areaSize; y++) {
      row = [];
      for (var x = 0; x < mapGenerator.mapWidth * this.areaSize; x++) {
        row.push(null);
      }
      gameWorld.tilemapArray.push(row);
    }

    for (var y = 0; y < mapGenerator.mapHeight; y++) {
      row = [];
      for (var x = 0; x < mapGenerator.mapWidth; x++) {
        var area = mapGenerator.areaMap[y][x]
        if (area == null) {
          mapGenerator.areaMap[y][x] = new Area(16, this.areaSize, x, y)
          area = mapGenerator.areaMap[y][x];
        }
        for (var areaY = 0; areaY < area.size; areaY++) {
          for (var areaX = 0; areaX < area.size; areaX++) {
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
  }

  createTile(x, y, image, type, area) {
    if(area != 16){
    x = x * this.tileSize;
    y = y * this.tileSize
    var tile = this.assetGroup.create(x, y, image);
    if (type == 0) {
      tile.inputEnabled = true;
      tile.events.onInputUp.add(function() {
        gameWorld.createTarget(tile);
      }, this);
    }
  }
  }

}
