function main() {
  console.log("main();");

  const GAMEWIDTH = 800;
  const GAMEHEIGHT = 600;

  // Initialize the phaser game window, give it a width of GAMEWIDTH and a height of GAMEHEIGHT, set the rendering context to auto and attach the window to a div with the ID "GameWindow"
  game = new Phaser.Game(GAMEWIDTH, GAMEHEIGHT, Phaser.AUTO, 'GameWindow', {
    preload: preload,
    create: create,
    update: update
  });
}

function preload() {
  console.log("Loading Assets...");
  // Load game assets \\
  game.load.image('wall', 'assets/wall.png');
  game.load.image('floor', 'assets/floor.png');
  game.load.image('ai', 'assets/ai.png');
  game.load.image('target', 'assets/target.png');
  console.log("Assets Loaded.");
}

function create() {
  console.log("Creating World...");
     game.stage.backgroundColor = "#4488AA";
  // Instantiate Game Classes \\
  ui = new UI();
  aStar = new AStar();
  gameWorld = new GameWorld();
  gameWorld.createMap();

  console.log("Creation complete.");
  ui.setScreen("MainMenu");
}

function update() {
  gameWorld.update();
}
