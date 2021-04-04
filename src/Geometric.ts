import CGDLSystem, { CGDLType } from "./CGDLSystem.js";

class Geometric extends CGDLSystem {
  constructor(id: number, context: CanvasRenderingContext2D) {
    super(id, CGDLType.geometric, context);
  }
}

export default Geometric;
