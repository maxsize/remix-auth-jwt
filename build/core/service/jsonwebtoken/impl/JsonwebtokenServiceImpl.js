"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonwebtokenServiceImpl = void 0;
class JsonwebtokenServiceImpl {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
        const jwt = require("jsonwebtoken");
        this.jwtSign = jwt.sign;
        this.jwtVerify = jwt.verify;
    }
    verify(token, secretOrPublicKey, options) {
        const result = this.jwtVerify(token, secretOrPublicKey, options);
        return result;
    }
    sign(
    // eslint-disable-next-line @typescript-eslint/ban-types
    payload, secretOrPrivateKey) {
        const result = this.jwtSign(payload, secretOrPrivateKey);
        return result;
    }
}
exports.JsonwebtokenServiceImpl = JsonwebtokenServiceImpl;
