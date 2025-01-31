import {Keys} from "./enums/enums"

let keystates = new Map();
keystates.set(Keys.Up, false);
keystates.set(Keys.Down, false);
keystates.set(Keys.Left, false);
keystates.set(Keys.Right, false);
[1,2,3,4].forEach(i => keystates.set("N"+i, false))

export function getKeyState(keytype) {
    return keystates.get(keytype)
}

let keyEventHandler = (eventtype, keytype) => {};

export function setKeyEventHandler(handler) {
    keyEventHandler = handler
}

export function clearKeyEventHandler(handler) {
  keyEventHandler = (a, b) => {};
}

[Keys.KeyUp, Keys.KeyDown].forEach((eventtype) => {
  document.body.addEventListener(eventtype.toLowerCase(), function (event) {
    let keytype = "";
    switch (event.key) {
      case "W":
      case "w":
      case "ArrowUp":
        keytype = Keys.Up;
        break;
      case "A":
      case "a":
      case "ArrowLeft":
        keytype = Keys.Left;
        break;
      case "S":
      case "s":
      case "ArrowDown":
        keytype = Keys.Down;
        break;
      case "D":
      case "d":
      case "ArrowRight":
        keytype = Keys.Right;
        break;
      default:
        break;
    }
    
    if(!isNaN(event.key) && event.key !== ' ')
      keytype = "N"+event.key;

    if(!keystates.has(keytype))
      return
    
    const iskeypressed = keystates.get(keytype);
    if (eventtype === Keys.KeyUp && iskeypressed) {
      keyEventHandler(eventtype, keytype);
      keystates.set(keytype, false);
    } else if (eventtype === Keys.KeyDown && !iskeypressed) {
      keyEventHandler(eventtype, keytype);
      keystates.set(keytype, true);
    }
  });
});
