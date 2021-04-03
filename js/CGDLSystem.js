var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _id, _type, _context;
class CGDLSystem {
    constructor(id, type, context) {
        _id.set(this, void 0);
        _type.set(this, void 0);
        _context.set(this, void 0);
        __classPrivateFieldSet(this, _id, id);
        __classPrivateFieldSet(this, _type, type);
        __classPrivateFieldSet(this, _context, context);
    }
}
_id = new WeakMap(), _type = new WeakMap(), _context = new WeakMap();
export default CGDLSystem;
