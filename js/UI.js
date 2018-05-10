
class UI {
  // This UI class is based on the https://github.com/Wolfkhan66/Phaser-First-Game-Tutorial repository in which i designed a system class to allow the dynamic creation of text and sprites as UI elements.
  // The code has been remodified and updated for this project.
  constructor() {
    console.log("Constructing UI Elements")
    this.elements = [];
    this.screen = "";

    //InGame UI
    this.createSprite("Toolbar", "InGame", 0, 548, 800, 52, 'toolbar');
    this.createSprite("newMapButton", "InGame", 466, 552, 210, 44, 'newMapUp');
    this.addEvent("newMapButton", function() {
      ui.loadSpriteTexture("newMapButton", 'newMapDown');
    }, function() {
      ui.loadSpriteTexture("newMapButton", 'newMapUp');
      gameWorld.cleanUp();
      gameWorld.createMap();
      ui.showUI("InGame");
    });

    this.createText("heightText", "InGame", 70, 565, mapGenerator.mapHeight, 18);
    this.createSprite("heightUpButton", "InGame", 100, 553, 21, 19, 'buttonUp');
    this.addEvent("heightUpButton", null, function() {
      if (mapGenerator.mapHeight < 25) {
        mapGenerator.mapHeight++;
        ui.setText("heightText", mapGenerator.mapHeight);
      }
    });
    this.createSprite("heightDownButton", "InGame", 100, 576, 21, 19, 'buttonDown');
    this.addEvent("heightDownButton", null, function() {
      if (mapGenerator.mapHeight > 3) {
        mapGenerator.mapHeight--;
        ui.setText("heightText", mapGenerator.mapHeight);
      }
    });

    this.createText("widthText", "InGame", 184, 565, mapGenerator.mapWidth, 18);
    this.createSprite("widthUpButton", "InGame", 214, 553, 21, 19, 'buttonUp');
    this.addEvent("widthUpButton", null, function() {
      if (mapGenerator.mapWidth < 25) {
        mapGenerator.mapWidth++;
        ui.setText("widthText", mapGenerator.mapWidth);
      }
    });
    this.createSprite("widthDownButton", "InGame", 214, 576, 21, 19, 'buttonDown');
    this.addEvent("widthDownButton", null, function() {
      if (mapGenerator.mapWidth > 3) {
        mapGenerator.mapWidth--;
        ui.setText("widthText", mapGenerator.mapWidth);
      }
    });

    this.createText("minimumText", "InGame", 298, 565, mapGenerator.minimumAreas, 18);
    this.createSprite("minimumUpButton", "InGame", 328, 553, 21, 19, 'buttonUp');
    this.addEvent("minimumUpButton", null, function() {
      if (mapGenerator.minimumAreas < (mapGenerator.mapWidth * mapGenerator.mapHeight)) {
        mapGenerator.minimumAreas++;
        ui.setText("minimumText", mapGenerator.minimumAreas);
      }
    });
    this.createSprite("minimumDownButton", "InGame", 328, 576, 21, 19, 'buttonDown');
    this.addEvent("minimumDownButton", null, function() {
      if (mapGenerator.minimumAreas > 1) {
        mapGenerator.minimumAreas--;
        ui.setText("minimumText", mapGenerator.minimumAreas);
      }
    });

    this.createText("areaSizeText", "InGame", 412, 565, gameWorld.areaSize, 18);
    this.createSprite("areaSizeUpButton", "InGame", 442, 553, 21, 19, 'buttonUp');
    this.addEvent("areaSizeUpButton", null, function() {
      if (gameWorld.areaSize < 6) {
        gameWorld.areaSize++;
        ui.setText("areaSizeText", gameWorld.areaSize);
      }
    });
    this.createSprite("areaSizeDownButton", "InGame", 442, 576, 21, 19, 'buttonDown');
    this.addEvent("areaSizeDownButton", null, function() {
      if (gameWorld.areaSize > 3) {
        gameWorld.areaSize--;
        ui.setText("areaSizeText", gameWorld.areaSize);
      }
    });

    this.createSprite("zoomInButton", "InGame", 768, 553, 21, 19, 'buttonUp');
    this.addEvent("zoomInButton", null, function() {
      gameWorld.assetGroup.scale.x += 0.04;
      gameWorld.assetGroup.scale.y += 0.04;
    });
    this.createSprite("zoomOutButton", "InGame", 768, 576, 21, 19, 'buttonDown');
    this.addEvent("zoomOutButton", null, function() {
      gameWorld.assetGroup.scale.x -= 0.04;
      gameWorld.assetGroup.scale.y -= 0.04;
    });

  }

  setScreen(screen) {
    this.hideAll();
    this.screen = screen;
    this.showUI(screen);
  }

  createText(name, UI, x, y, string, size) {
    var textObject = game.add.text(x, y, string, {
      font: size + 'px Arial',
      fill: '#000'
    });
    textObject.fixedToCamera = true;
    textObject.cameraOffset.setTo(x, y);
    this.elements.push({
      Name: name,
      UI: UI,
      Type: "Text",
      Object: textObject
    });
  }

  createSprite(name, UI, x, y, width, height, image) {
    var sprite = game.add.sprite(x, y, image);
    sprite.width = width;
    sprite.height = height;
    sprite.fixedToCamera = true;
    sprite.cameraOffset.setTo(x, y);
    this.elements.push({
      Name: name,
      UI: UI,
      Type: "Sprite",
      Object: sprite
    });
  }

  loadSpriteTexture(name, image) {
    this.elements.forEach((element) => {
      if (element.Name == name) {
        element.Object.loadTexture(image);
      }
    });
  }

  setText(name, string) {
    this.elements.forEach((element) => {
      if (element.Name == name) {
        element.Object.text = string;
      }
    });
  }

  addEvent(name, eventDown, eventUp) {
    this.elements.forEach(function(element) {
      if (element.Name == name) {
        if (eventDown != null) {
          element.Object.inputEnabled = true;
          element.Object.events.onInputDown.add(eventDown, this);
        }
        if (eventUp != null) {
          element.Object.inputEnabled = true;
          element.Object.events.onInputUp.add(eventUp, this);
        }
      }
    });
  }

  showUI(UIType) {
    this.elements.forEach(function(element) {
      if (element.UI == UIType) {
        element.Object.visible = true;
        element.Object.bringToTop();
      }
    });
  }

  hideAll() {
    this.elements.forEach(function(element) {
      element.Object.visible = false;
    });
  }
}
