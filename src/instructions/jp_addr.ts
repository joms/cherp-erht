import { CPU } from "../CPU";

export const JP_ADDR = (opcode: number, cpu: CPU) => {
  cpu.pc = opcode & 0xfff;
};
