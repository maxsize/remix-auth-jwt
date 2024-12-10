import { JsonwebtokenService } from "../JsonwebtokenService";
import type * as jsonwebtoken from "jsonwebtoken-esm";
export declare class JsonwebtokenEsmServiceImpl implements JsonwebtokenService {
    protected jwtSign: typeof jsonwebtoken.sign;
    protected jwtVerify: typeof jsonwebtoken.verify;
    constructor();
    verify(token: string, secretOrPublicKey: jsonwebtoken.Secret, options: {
        algorithms?: jsonwebtoken.Algorithm[];
    }): string | jsonwebtoken.JwtPayload;
    sign(payload: string | object | Buffer, secretOrPrivateKey: jsonwebtoken.Secret): string;
}
