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
var _canvas, _context;
class CGDL {
    constructor() {
        _canvas.set(this, void 0);
        _context.set(this, void 0);
        __classPrivateFieldSet(this, _canvas, document.getElementById("cgdl-canvas"));
        __classPrivateFieldSet(this, _context, __classPrivateFieldGet(this, _canvas).getContext("2d"));
    }
}
_canvas = new WeakMap(), _context = new WeakMap();
export default CGDL;
