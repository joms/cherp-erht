import { CPU } from "./CPU";

export class Debugger {
  cpu: CPU;
  reset: VoidFunction;
  onPause: (paused: boolean) => void;
  breakpointList: Array<number> = [];

  paused = false;

  constructor(
    cpu: CPU,
    reset: VoidFunction,
    onPause: (paused: boolean) => void,
  ) {
    this.cpu = cpu;
    this.reset = reset;
    this.onPause = onPause;

    document.addEventListener("click", (e) => {
      for (let i = 0; i < this.cpu.memory.length; i++) {
        const index = i + 0x200;

        const target = (e.target as Element | null)?.closest(`#btn-${index}`);
        if (target) {
          const isActiveBreakpoint = this.breakpointList.includes(index);
          if (isActiveBreakpoint) {
            this.breakpointList = this.breakpointList.filter(
              (v) => v !== index,
            );
          } else {
            this.breakpointList.push(index);
          }

          this.update();
        }
      }
    });
  }

  private updateRegistersView() {
    const registersMountPoint = document.getElementById("registersView");

    if (!registersMountPoint) {
      return;
    }

    const items: Record<string, string> = {
      "Program counter": "0x" + this.cpu.pc.toString(16),
      Index: "0x" + this.cpu.index.toString(16),
      "Stack pointer": this.cpu.sp.toString(),
      "Sound timer": this.cpu.soundTimer.toString(),
      "Delay timer": this.cpu.delayTimer.toString(),
    };

    this.cpu.registers.forEach((v, i) => {
      items["V" + i.toString(16).toUpperCase()] = "0x" + v.toString(16);
    });

    const list = document.createElement("dl");

    Object.entries(items).forEach(([key, value]) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("flex");
      wrapper.classList.add("justify-between");
      wrapper.classList.add("gap-4");

      const dt = document.createElement("dt");
      dt.append(document.createTextNode(key));

      const dd = document.createElement("dd");
      dd.textContent = value;

      wrapper.appendChild(dt);
      wrapper.appendChild(dd);

      list.appendChild(wrapper);
    });

    registersMountPoint.innerHTML = list.outerHTML;
    registersMountPoint.classList.add("border");
  }

  private updateMemoryView() {
    const memoryMountPoint = document.getElementById("memoryView");

    if (!memoryMountPoint) {
      return;
    }

    const list = document.createElement("dl");

    for (let i = 0; i < this.cpu.memory.length; i++) {
      const index = i + 0x200;

      const wrapper = document.createElement("div");
      wrapper.classList.add("flex");
      wrapper.classList.add("justify-between");
      wrapper.classList.add("gap-4");
      wrapper.classList.add("px-2");

      if (index === this.cpu.pc) {
        wrapper.classList.add("bg-emerald-500");
        wrapper.classList.add("text-white");
      }

      const dt = document.createElement("dt");
      dt.classList.add("flex");
      dt.classList.add("items-center");

      const breakpointButton = document.createElement("button");
      breakpointButton.id = `btn-${index.toString()}`;

      breakpointButton.classList.add("w-3");
      breakpointButton.classList.add("h-3");
      breakpointButton.classList.add("mr-3");
      breakpointButton.classList.add("rounded");
      breakpointButton.classList.add("border");
      breakpointButton.classList.add("border-red-500");
      breakpointButton.classList.add("hover:bg-red-800");

      const isActiveBreakpoint = this.breakpointList.includes(index);
      if (isActiveBreakpoint) {
        breakpointButton.classList.add("bg-red-500");
      }

      dt.appendChild(breakpointButton);
      dt.appendChild(document.createTextNode("0x" + index.toString(16)));

      const dd = document.createElement("dd");
      const opcode = (this.cpu.memory[index] << 8) | this.cpu.memory[index + 1];
      dd.textContent = opcode.toString(16);

      wrapper.appendChild(dt);
      wrapper.appendChild(dd);

      list.appendChild(wrapper);
    }

    memoryMountPoint.innerHTML = list.outerHTML;
    memoryMountPoint.classList.add("border");
  }

  private updateControllers() {
    const pauseButton = document.getElementById("pauseButton");
    const stepButton = document.getElementById("stepButton");
    const resetButton = document.getElementById("resetButton");

    if (!pauseButton || !resetButton || !stepButton) {
      return;
    }

    pauseButton.onclick = () => this.handlePause();

    stepButton.onclick = () => {
      this.cpu.cycle();
      this.update();
    };

    resetButton.onclick = this.reset;
  }

  handlePause(paused?: boolean) {
    const pauseButton = document.getElementById("pauseButton");
    if (!pauseButton) {
      return;
    }

    this.paused = paused ?? !this.paused;
    this.onPause(this.paused);

    if (this.paused) {
      pauseButton.textContent = "Resume";
    } else {
      pauseButton.textContent = "Pause";
    }
  }

  update() {
    if (this.breakpointList.includes(this.cpu.pc)) {
      this.handlePause(true);
    }

    this.updateRegistersView();
    this.updateMemoryView();
    this.updateControllers();
  }
}
