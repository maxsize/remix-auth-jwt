"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonwebtokenEsmServiceImpl = void 0;
class JsonwebtokenEsmServiceImpl {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
        const jwt = require("jsonwebtoken-esm");
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
exports.JsonwebtokenEsmServiceImpl = JsonwebtokenEsmServiceImpl;
