import { CPU } from "../CPU";
import { getArguments } from "./getArguments";

export const DRW_VX_VY_NIBBLE = (opcode: number, cpu: CPU) => {
  const [xCoord, yCoord] = getArguments(opcode);

  const width = 8;
  const height = opcode & 0xf;

  cpu.registers[0xf] = 0;

  for (let y = 0; y < height; y++) {
    let sprite = cpu.memory[cpu.index + y];

    for (let x = 0; x < width; x++) {
      if ((sprite & 0x80) !== 0) {
        if (
          cpu.renderer.setPixel(
            cpu.registers[xCoord] + x,
            cpu.registers[yCoord] + y,
          )
        ) {
          cpu.registers[0xf] = 1;
        }
      }

      sprite <<= 1;
    }
  }
};
