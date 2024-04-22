import { CPU } from "../CPU";
import { getArguments } from "./getArguments";

export const ADD_VX_BYTE = (opcode: number, cpu: CPU) => {
  const [x] = getArguments(opcode);

  cpu.registers[x] += opcode & 0xff;
};
