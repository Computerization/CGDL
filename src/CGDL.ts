class CGDL {
  #canvas: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  constructor() {
    this.#canvas = document.getElementById("cgdl-canvas") as HTMLCanvasElement;
    this.#context = this.#canvas.getContext("2d");
  }
  /*
  get canvas() {
    return this.#canvas;
  }
  get context() {
    return this.#context;
  }
  */
}

export default CGDL;
