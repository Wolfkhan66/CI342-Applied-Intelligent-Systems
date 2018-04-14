﻿
class UI {
  // This UI class is based on the https://github.com/Wolfkhan66/Phaser-First-Game-Tutorial repository in which i designed a system class to allow the dynamic creation of text and sprites as UI elements.
  // The code has been remodified and updated for this project.
  constructor() {
    console.log("Constructing UI Elements")
    this.elements = [];
    this.screen = "";

    //MainMenu UI
    this.createText("MainMenuText", "MainMenu", 400, 300, "This is the Main Menu", 30);
    this.addEvent("MainMenuText", null, function() {
      ui.setScreen("InGame");
    });

    //InGame UI

  }

  setScreen(screen) {
    this.hideAll();
    this.screen = screen;
    switch (screen) {
      case "MainMenu":
        this.showUI("MainMenu");
        break;
      case "InGame":
        this.showUI("InGame");
        break;
      default:
        console.log(screen + " not found");
    }
  }

  createText(name, UI, x, y, string, size) {
    var textObject = game.add.text(x, y, string, {
      font: size + 'px Arial',
      fill: '#ffffff'
    });
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
    this.elements.push({
      Name: name,
      UI: UI,
      Type: "Sprite",
      Object: sprite
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
      }
    });
  }

  hideAll() {
    this.elements.forEach(function(element) {
      element.Object.visible = false;
    });
  }
}
