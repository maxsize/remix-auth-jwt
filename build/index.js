import "reflect-metadata";
import { Strategy } from 'remix-auth/strategy';
import { container } from "tsyringe";
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
function jsonwebtokenModule() {
    if (typeof process !== "undefined" &&
        process.versions &&
        process.versions.node) {
        container.register("JsonwebtokenService", {
            useClass: JsonwebtokenServiceImpl,
        });
    }
    else {
        container.register("JsonwebtokenService", {
            useClass: JsonwebtokenEsmServiceImpl,
        });
    }
}
jsonwebtokenModule();
export class JwtStrategy extends Strategy {
    // public verify: VerifyFunction<User, JwtStrategyVerifyParams>
    constructor(options, verify) {
        super(verify);
        this.name = "jwt";
        // this.verify = verify;
        this.secret = options.secret;
        this.algorithms = options.algorithms;
        this.jwt = container.resolve("JsonwebtokenService");
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
