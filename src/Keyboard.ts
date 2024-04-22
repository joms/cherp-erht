const KEYMAP: Record<string, number> = {
  "1": 0x1, // 1
  "2": 0x2, // 2
  "3": 0x3, // 3
  "4": 0xc, // 4
  q: 0x4, // Q
  w: 0x5, // W
  e: 0x6, // E
  r: 0xd, // R
  a: 0x7, // A
  s: 0x8, // S
  d: 0x9, // D
  f: 0xe, // F
  z: 0xa, // Z
  x: 0x0, // X
  c: 0xb, // C
  v: 0xf, // V
};

export class Keyboard {
  keysPressed: Record<keyof typeof KEYMAP, boolean> = {};
  onNextKeyPress: ((key: number) => void) | null = null;

  constructor() {
    window.addEventListener("keydown", this.onKeyDown.bind(this), false);
    window.addEventListener("keyup", this.onKeyUp.bind(this), false);
  }

  onKeyDown(event: KeyboardEvent) {
    const key = KEYMAP[event.key];

    if (!key) {
      return;
    }

    this.keysPressed[key] = true;

    if (this.onNextKeyPress !== null) {
      this.onNextKeyPress(parseInt(key.toString()));
      this.onNextKeyPress = null;
    }
  }
  onKeyUp(event: KeyboardEvent) {
    const key = KEYMAP[event.key];
    this.keysPressed[key] = false;
  }

  isKeyPressed(keyCode: number) {
    return this.keysPressed[keyCode];
  }
}
