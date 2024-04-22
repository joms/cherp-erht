import { CPU } from "./CPU";
import { Debugger } from "./Debugger";
import { Keyboard } from "./Keyboard";
import { Renderer } from "./Renderer";
import { Speaker } from "./Speaker";

const FPS = 2;
const FPS_INTERVAL = 1000 / FPS;

class Chip8 {
  renderer: Renderer;
  keyboard: Keyboard;
  speaker: Speaker;
  cpu: CPU;
  paused = false;

  debugger: Debugger;

  lastStep = Date.now();

  constructor() {
    this.renderer = new Renderer(10);
    this.keyboard = new Keyboard();
    this.speaker = new Speaker();
    this.cpu = new CPU(this.renderer, this.keyboard, this.speaker);

    this.debugger = new Debugger(
      this.cpu,
      this.reset.bind(this),
      this.setPaused.bind(this),
    );

    window.addEventListener("keydown", (e) => {
      if (e.key === " ") {
        this.paused = !this.paused;
        console.log("set paused", this.paused);
      }
    });
  }

  public init() {
    this.renderer.render();
    this.lastStep = Date.now();
    this.cpu.loadSpritesIntoMemory();
    this.cpu.loadRom("IBM_TEST");

    requestAnimationFrame(this.step.bind(this));
  }

  reset() {
    let shouldUnpause = false;
    if (!this.paused) {
      this.paused = true;
      shouldUnpause = true;
    }

    this.renderer.clear();
    this.cpu.reset();
    this.init();
    this.debugger.update();

    if (shouldUnpause) {
      this.paused = false;
    }
  }

  setPaused(paused: boolean) {
    this.paused = paused;
  }

  step() {
    if (this.paused) {
      requestAnimationFrame(this.step.bind(this));
      return;
    }

    const now = Date.now();
    const elapsed = now - this.lastStep;

    if (elapsed > FPS_INTERVAL) {
      this.lastStep = Date.now();
      this.cpu.cycle();
      this.debugger.update();
    }

    requestAnimationFrame(this.step.bind(this));
  }
}

const chip8 = new Chip8();
chip8.init();
