import { CPU } from "../CPU";
import { getArguments } from "./getArguments";

export const DRW_VX_VY_NIBBLE = (opcode: number, cpu: CPU) => {
  const [x, y] = getArguments(opcode);

  const width = 8;
  const height = opcode & 0xf;

  cpu.registers[0xf] = 0;

  for (let row = 0; row < height; row++) {
    let sprite = cpu.memory[cpu.index + row];

    for (let col = 0; col < width; col++) {
      if ((sprite & 0x80) > 0) {
        const xCoord = cpu.registers[x] + col;
        const yCoord = cpu.registers[y] + row;

        if (cpu.renderer.setPixel(xCoord, yCoord)) {
          cpu.registers[0xf] = 1;
        }
      }

      sprite <<= 1;
    }
  }
};
