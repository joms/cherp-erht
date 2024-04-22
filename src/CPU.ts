import { Keyboard } from "./Keyboard";
import { Renderer } from "./Renderer";
import { Speaker } from "./Speaker";

import BLINKY from "./roms/BLINKY?arraybuffer";
import BLITZ from "./roms/BLITZ?arraybuffer";
import SPLASH_SCREEN_TEST from "./roms/1-chip8-logo.ch8?arraybuffer";
import IBM_TEST from "./roms/IBM?arraybuffer";
import OPCODE_TEST from "./roms/3-corax+.ch8?arraybuffer";
import { CLS } from "./instructions/cls";
import { RET } from "./instructions/ret";
import { LD_VX_BYTE } from "./instructions/ld_vx_byte";
import { LD_I_ADDR } from "./instructions/ld_i_addr";
import { ADD_VX_BYTE } from "./instructions/add_vx_byte";
import { JP_ADDR } from "./instructions/jp_addr";
import { DRW_VX_VY_NIBBLE } from "./instructions/drw_vx_vy_nibble";

const ROMS = {
  BLINKY,
  BLITZ,
  SPLASH_SCREEN_TEST,
  IBM_TEST,
  OPCODE_TEST,
} as const;

export class CPU {
  renderer: Renderer;
  keyboard: Keyboard;
  speaker: Speaker;

  memory = new Uint8Array(4096);
  registers = new Uint8Array(16);
  stack = new Uint16Array(16);

  soundTimer = 0;
  delayTimer = 0;

  index = 0;
  sp = -1;
  pc = 0x200;

  paused = false;
  speed = 1;

  constructor(renderer: Renderer, keyboard: Keyboard, speaker: Speaker) {
    this.renderer = renderer;
    this.keyboard = keyboard;
    this.speaker = speaker;
  }

  public reset() {
    this.pc = 0x200;
    this.sp = -1;
    this.soundTimer = 0;
    this.delayTimer = 0;
    this.index = 0;

    this.memory = new Uint8Array(4096);
    this.registers = new Uint8Array(16);
    this.stack = new Uint16Array(16);
  }

  loadSpritesIntoMemory() {
    SPRITES.forEach((sprite, index) => (this.memory[index] = sprite));
  }

  loadProgramIntoMemory(program: Uint8Array) {
    program.forEach((data, index) => {
      this.memory[0x200 + index] = data;
    });
  }

  async loadRom(romName: keyof typeof ROMS) {
    const program = new Uint8Array(ROMS[romName]);
    this.loadProgramIntoMemory(program);
  }

  cycle() {
    for (let i = 0; i < this.speed; i++) {
      if (this.paused) {
        throw new Error("BSOD due to paused CPU");
      }

      const opcode = (this.memory[this.pc] << 8) | this.memory[this.pc + 1];
      this.incrementPc();
      this.executeInstruction(opcode);
    }

    this.updateTimers();
    this.playSound();
    this.renderer.render();
  }

  updateTimers() {
    if (this.delayTimer > 0) {
      this.delayTimer -= 1;
    }

    if (this.soundTimer > 0) {
      this.soundTimer -= 1;
    }
  }

  playSound() {
    if (this.soundTimer > 0) {
      this.speaker.play(440);
    } else {
      this.speaker.stop();
    }
  }

  incrementPc() {
    this.pc += 2;
  }

  executeInstruction(opcode: number) {
    switch (opcode & 0xf000) {
      case 0x0000:
        switch (opcode) {
          case 0x00e0:
            CLS(this);
            break;

          case 0x00ee:
            RET(this);
            break;
        }
        break;

      case 0x1000:
        JP_ADDR(opcode, this);
        break;

      case 0x6000:
        LD_VX_BYTE(opcode, this);
        break;

      case 0x7000:
        ADD_VX_BYTE(opcode, this);
        break;

      case 0xa000:
        LD_I_ADDR(opcode, this);
        break;

      case 0xd000:
        DRW_VX_VY_NIBBLE(opcode, this);
        break;

      default:
        throw new Error(`Unknown upcode: ${opcode.toString(16)}`);
    }
  }
}

const SPRITES = [
  0xf0,
  0x90,
  0x90,
  0x90,
  0xf0, // 0
  0x20,
  0x60,
  0x20,
  0x20,
  0x70, // 1
  0xf0,
  0x10,
  0xf0,
  0x80,
  0xf0, // 2
  0xf0,
  0x10,
  0xf0,
  0x10,
  0xf0, // 3
  0x90,
  0x90,
  0xf0,
  0x10,
  0x10, // 4
  0xf0,
  0x80,
  0xf0,
  0x10,
  0xf0, // 5
  0xf0,
  0x80,
  0xf0,
  0x90,
  0xf0, // 6
  0xf0,
  0x10,
  0x20,
  0x40,
  0x40, // 7
  0xf0,
  0x90,
  0xf0,
  0x90,
  0xf0, // 8
  0xf0,
  0x90,
  0xf0,
  0x10,
  0xf0, // 9
  0xf0,
  0x90,
  0xf0,
  0x90,
  0x90, // A
  0xe0,
  0x90,
  0xe0,
  0x90,
  0xe0, // B
  0xf0,
  0x80,
  0x80,
  0x80,
  0xf0, // C
  0xe0,
  0x90,
  0x90,
  0x90,
  0xe0, // D
  0xf0,
  0x80,
  0xf0,
  0x80,
  0xf0, // E
  0xf0,
  0x80,
  0xf0,
  0x80,
  0x80, // F
];
