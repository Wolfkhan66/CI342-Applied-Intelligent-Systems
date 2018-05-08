class GameWorld {
  constructor() {
    console.log("Constructing Game World");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.target = null;
    this.ai = null;
    this.mapGenerator = new MapGenerator();
    this.pathFound = false;
    this.path = [];
    this.assets = [];
    this.tweenActive = false;
  }

  update() {
    if (this.target != null && this.pathFound == false) {
      this.path = aStar.calculatePath(this.ai, this.target, this.mapGenerator.tilemapArray);
      this.pathFound = true;
    }
    if (this.pathFound) {
      if (this.path[0] != null && !this.tweenActive) {
        this.ai.tween = game.add.tween(this.ai);
        var duration = 50;
        this.ai.tween.to({
          x: this.path[0].x * 8,
          y: this.path[0].y * 8
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
    this.assets.forEach(asset => asset.destroy());
    this.assets = [];
    this.mapGenerator.tiles.forEach(tile => tile.sprite.destroy());
        this.mapGenerator.tiles = [];
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
    this.target = game.add.sprite(sprite.x * gameWorld.mapGenerator.tileSize, sprite.y * gameWorld.mapGenerator.tileSize, 'target')
    this.assets.push(this.target);
  }

  createMap() {
    this.mapGenerator.createMap();
    this.mapGenerator.fillTilemap();
    this.createAISprite();
  }

  createAISprite() {
    var x = this.mapGenerator.getRandomInt(0, this.mapGenerator.mapWidth - 1);
    var y = this.mapGenerator.getRandomInt(0, this.mapGenerator.mapHeight - 1);
    if (this.mapGenerator.areaMap[y][x].type != 16) {
      if (this.ai == null) {
        this.ai = game.add.sprite(((x * this.mapGenerator.areaSize) * 8) + 16, ((y * this.mapGenerator.areaSize) * 8) + 16, 'ai')
      } else {
        this.ai.x = ((x * this.mapGenerator.areaSize) * 8) + 16;
        this.ai.y = ((y * this.mapGenerator.areaSize) * 8) + 16;
        this.ai.bringToTop();
      }
    } else {
      this.createAISprite();
      this.assets.push(this.ai);
    }
  }
}
