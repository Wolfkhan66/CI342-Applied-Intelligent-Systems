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
  console.log("Assets Loaded.");
}

function create() {
  console.log("Creating World...");
  // Instantiate Game Classes \\
  ui = new UI();
  gameWorld = new GameWorld();
  console.log("Creation complete.");

  ui.setScreen("MainMenu");
}

function update() {

}
