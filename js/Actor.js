var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _appearanceType;
import CGDLSystem from './CGDLSystem.js';
class Actor extends CGDLSystem {
    constructor(id, context, appearanceType) {
        super(id, 2, context);
        _appearanceType.set(this, undefined);
        __classPrivateFieldSet(this, _appearanceType, appearanceType);
    }
    bindTexture(textureData) {
        if (__classPrivateFieldGet(this, _appearanceType) != Actor.APPEARANCE_TEXTURE) {
            throw "CGDLError: Apperance Type does not match with this method.";
        }
    }
    bindGeometric(geometricData) {
        if (__classPrivateFieldGet(this, _appearanceType) != Actor.APPEARANCE_GEOMETRIC) {
            throw "CGDLError: Apperance Type does not match with this method.";
        }
    }
}
_appearanceType = new WeakMap();
Actor.APPEARANCE_TEXTURE = 0;
Actor.APPEARANCE_GEOMETRIC = 1;
export default Actor;
