class Area {
  constructor(type, size, x, y) {
    this.type = type;
    this.size = size;
    this.x = x;
    this.y = y;
    this.tilemap = [];
    this.boundaries = [];
    this.exits = [];
    this.processed = false;
    this.setupArea(type, size);
  }

  fillTilemap(exits, size) {
    var tilemap = [];
    var row = [];
    var tile = 0;
    for (var y = 0; y < size; y++) {
      row = [];
      for (var x = 0; x < size; x++) {
        tile = 0;
        this.boundaries.forEach((direction) => {
          switch (direction) {
            case "right":
              if (x == size - 1) {
                tile = 1;
              }
              break;
            case "left":
              if (x == 0) {
                tile = 1;
              }
              break;
            case "up":
              if (y == 0) {
                tile = 1;
              }
              break;
            case "down":
              if (y == size - 1) {
                tile = 1;
              }
              break;
            default:
          }
        });
        row.push(tile);
      }
      tilemap.push(row);
    }
    return tilemap;
  }

  setupArea(type) {
    switch (type) {
      case 1:
        this.boundaries.push("right");
        this.exits.push("left");
        this.exits.push("up");
        this.exits.push("down");
        break;
      case 2:
        this.exits.push("right");
        this.boundaries.push("left");
        this.exits.push("up");
        this.exits.push("down");
        break;
      case 3:
        this.exits.push("right");
        this.exits.push("left");
        this.boundaries.push("up");
        this.exits.push("down");
        break;
      case 4:
        this.exits.push("right");
        this.exits.push("left");
        this.exits.push("up");
        this.boundaries.push("down");
        break;
      case 5:
        this.boundaries.push("right");
        this.exits.push("left");
        this.boundaries.push("up");
        this.exits.push("down");
        break;
      case 6:
        this.boundaries.push("right");
        this.exits.push("left");
        this.exits.push("up");
        this.boundaries.push("down");
        break;
      case 7:
        this.exits.push("right");
        this.boundaries.push("left");
        this.exits.push("up");
        this.boundaries.push("down");
        break;
      case 8:
        this.exits.push("right");
        this.boundaries.push("left");
        this.boundaries.push("up");
        this.exits.push("down");
        break;
      case 9:
        this.boundaries.push("right");
        this.boundaries.push("left");
        this.exits.push("up");
        this.exits.push("down");
        break;
      case 10:
        this.exits.push("right");
        this.exits.push("left");
        this.boundaries.push("up");
        this.boundaries.push("down");
        break;
      case 11:
        this.exits.push("right");
        this.boundaries.push("left");
        this.boundaries.push("up");
        this.boundaries.push("down");
        break;
      case 12:
        this.boundaries.push("right");
        this.exits.push("left");
        this.boundaries.push("up");
        this.boundaries.push("down");
        break;
      case 13:
        this.boundaries.push("right");
        this.boundaries.push("left");
        this.boundaries.push("up");
        this.exits.push("down");
        break;
      case 14:
        this.boundaries.push("right");
        this.boundaries.push("left");
        this.exits.push("up");
        this.boundaries.push("down");
        break;
      case 15:
        this.boundaries.push("right");
        this.boundaries.push("left");
        this.boundaries.push("up");
        this.boundaries.push("down");
        break;
      case 16:
        this.exits.push("right");
        this.exits.push("left");
        this.exits.push("up");
        this.exits.push("down");
        break;
      default:
    }
    this.tilemap = this.fillTilemap(this.boundaries, this.size);
  }
}
