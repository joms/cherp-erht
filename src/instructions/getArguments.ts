export const getArguments = (opcode: number): [x: number, y: number] => {
  const x = (opcode & 0x0f00) >> 8;
  const y = (opcode & 0x00f0) >> 4;

  return [x, y];
};
