import CGDLSystem from "./CGDLSystem.js";

class Actor extends CGDLSystem {
  static APPEARANCE_TEXTURE: number = 0;
  static APPEARANCE_GEOMETRIC: number = 1;
  #appearanceType: number = undefined;
  constructor(
    id: number,
    context: CanvasRenderingContext2D,
    appearanceType: number
  ) {
    super(id, 2, context);
    this.#appearanceType = appearanceType;
  }
  bindTexture(textureData): void {
    if (this.#appearanceType != Actor.APPEARANCE_TEXTURE) {
      throw "CGDLError: Apperance Type does not match with this method.";
    }
  }
  bindGeometric(geometricData): void {
    if (this.#appearanceType != Actor.APPEARANCE_GEOMETRIC) {
      throw "CGDLError: Apperance Type does not match with this method.";
    }
  }
}

export default Actor;
