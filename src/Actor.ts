import CGDLSystem, { CGDLType } from "./CGDLSystem.js";

enum appearance {
  texture,
  geometric,
}

class Actor extends CGDLSystem {
  #appearanceType: appearance;
  #appearanceData: number;

  constructor(
    id: number,
    context: CanvasRenderingContext2D,
    appearanceType: number
  ) {
    super(id, CGDLType.actor, context);
    this.#appearanceType = appearanceType;
  }

  bindTexture(textureData: number): void {
    if (this.#appearanceType != appearance.texture)
      throw new TypeError(
        "CGDLError: Apperance Type does not match with this method."
      );
    this.#appearanceData = textureData;
  }

  bindGeometric(geometricData: number): void {
    if (this.#appearanceType != appearance.geometric)
      throw new TypeError(
        "CGDLError: Apperance Type does not match with this method."
      );
    this.#appearanceData = geometricData;
  }
}

export default Actor;
