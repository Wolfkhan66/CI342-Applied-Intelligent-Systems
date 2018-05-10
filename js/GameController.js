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
  game.load.image('toolbar', 'assets/toolbar.png');
  game.load.image('buttonDown', 'assets/buttonDown.png');
  game.load.image('buttonUp', 'assets/buttonUp.png');
  game.load.image('newMapDown', 'assets/newMapDown.png');
  game.load.image('newMapUp', 'assets/newMapUp.png');
  console.log("Assets Loaded.");
}

function create() {
  console.log("Creating World...");
  game.stage.backgroundColor = "#ccccff";
  game.camera.bounds = null;
  game.input.mouse.mouseWheelCallback = mouseWheel;
  // Instantiate Game Classes \\
  mapGenerator = new MapGenerator();
  gameWorld = new GameWorld();
  aStar = new AStar();
  ui = new UI();
  gameWorld.createMap();

  console.log("Creation complete.");
  ui.setScreen("InGame");
}

function mouseWheel(event) {
  // Detect movement of the mouse wheel and zoom in or out accordingly
  if (game.input.mouse.wheelDelta === Phaser.Mouse.WHEEL_UP) {
    gameWorld.assetGroup.scale.x += 0.04;
    gameWorld.assetGroup.scale.y += 0.04;
  } else {
    gameWorld.assetGroup.scale.x -= 0.04;
    gameWorld.assetGroup.scale.y -= 0.04;
  }
}

function update() {
  // Detect keybourd input for the arrow keys and move the game camera
  var cursors = game.input.keyboard.createCursorKeys();
  if (cursors.left.isDown && game.camera.x > -50) {
    game.camera.x -= 2;
  }
  if (cursors.right.isDown) {
    game.camera.x += 2;
  }
  if (cursors.up.isDown && game.camera.y > -50) {
    game.camera.y -= 2;
  }
  if (cursors.down.isDown) {
    game.camera.y += 2;
  }

  gameWorld.update();
}
