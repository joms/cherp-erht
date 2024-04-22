import { CPU } from "../CPU";

export const RET = (cpu: CPU) => {
  if (cpu.sp === -1) {
    cpu.paused = true;
    throw new Error("Stack underflow");
  }

  cpu.pc = cpu.stack[cpu.pc];
  cpu.sp -= 1;
};
