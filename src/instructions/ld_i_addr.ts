import { CPU } from "../CPU";

export const LD_I_ADDR = (opcode: number, cpu: CPU) => {
  cpu.index = opcode & 0xfff;
};
