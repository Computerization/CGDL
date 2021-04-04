export enum CGDLType {
  geometric,
  actor,
}

class CGDLSystem {
  #id: number;
  #type: number;
  #context: CanvasRenderingContext2D;

  constructor(id: number, type: CGDLType, context: CanvasRenderingContext2D) {
    this.#id = id;
    this.#type = type;
    this.#context = context;
  }

  get id() {
    return this.#id;
  }
  get type() {
    return this.#type;
  }
  get context() {
    return this.#context;
  }
}

export default CGDLSystem;
