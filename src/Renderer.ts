export class Renderer {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  cols = 64 as const;
  rows = 32 as const;
  scale: number;

  display: Array<number>;

  constructor(scale: number) {
    this.scale = scale;
    const canvas = document.getElementById(
      "display",
    ) as HTMLCanvasElement | null;

    if (!canvas) {
      throw "Could not find canvas";
    }

    this.canvas = canvas;

    const ctx = this.canvas.getContext("2d");

    if (!ctx) {
      throw "Could not get 2D-context from canvas";
    }

    this.ctx = ctx;

    this.canvas.width = this.cols * this.scale;
    this.canvas.height = this.rows * this.scale;

    this.display = new Array(this.cols * this.rows);
  }

  public setPixel(x: number, y: number) {
    const px = x % this.cols;
    const py = y % this.rows;

    const pixelLocation = px + py * this.cols;

    if (pixelLocation > this.display.length) {
      throw new Error("Display out of bounds");
    }

    this.display[pixelLocation] ^= 1;

    return !this.display[pixelLocation];
  }

  public clear() {
    this.display = new Array(this.cols * this.rows);
  }

  public render() {
    this.ctx.fillStyle = "salmon";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        const pixel = this.display[x + y * this.cols];
        if (pixel) {
          this.ctx.fillStyle = "black";
          this.ctx.fillRect(
            x * this.scale,
            y * this.scale,
            this.scale,
            this.scale,
          );
        }
      }
    }

    // this.display.forEach((pixel, index) => {
    //   if (pixel) {
    //     const x = (index % this.cols) * this.scale;
    //     const y = Math.floor(index / this.cols) * this.scale;
    //
    //     this.ctx.fillStyle = "black";
    //     this.ctx.fillRect(x, y, this.scale, this.scale);
    //   }
    // });
  }

  public testRender(value: Array<[number, number]>) {
    value.forEach(([x, y]) => this.setPixel(x, y));
  }
}
