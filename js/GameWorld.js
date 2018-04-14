class GameWorld {
  constructor() {
    console.log("Constructing Game World");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    this.assets = [];
  }

  update() {

  }

  cleanUp() {
    this.assets.forEach(asset => asset.Sprite.destroy());
    this.assets = [];
  }
}
