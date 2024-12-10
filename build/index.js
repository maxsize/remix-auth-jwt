"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const JsonwebtokenModule_js_1 = require("./core/service/di/JsonwebtokenModule.js");
(0, JsonwebtokenModule_js_1.jsonwebtokenModule)();
class JwtStrategy {
    constructor(options, verify) {
        this.name = "jwt";
        // super(verify);
        this.verify = verify;
        this.secret = options.secret;
        this.algorithms = options.algorithms;
        this.jwt = tsyringe_1.container.resolve("JsonwebtokenService");
        if (options.getToken) {
            this.getToken = options.getToken;
        }
    }
    async authenticate(request) {
        var _a;
        let token;
        try {
            token = this.getToken
                ? await this.getToken(request)
                : (_a = request.headers.get("Authorization")) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            if (token == undefined) {
                throw new ReferenceError('Jwt token is missing');
            }
            const decoded = this.jwt.verify(token, this.secret, {
                algorithms: this.algorithms,
            });
            if (!decoded) {
                throw new ReferenceError('Invalid token');
            }
            const user = await this.verify({
                payload: decoded,
            });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new ReferenceError(error.message);
            }
            if (typeof error === "string") {
                throw new ReferenceError(error);
            }
            throw new ReferenceError('Unknown error');
        }
    }
}
exports.JwtStrategy = JwtStrategy;
