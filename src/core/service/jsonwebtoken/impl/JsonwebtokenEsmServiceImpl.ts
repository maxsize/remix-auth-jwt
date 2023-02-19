import { JsonwebtokenService } from "../JsonwebtokenService";
import type * as jsonwebtoken from "jsonwebtoken-esm";

export class JsonwebtokenEsmServiceImpl implements JsonwebtokenService {
  protected jwtSign: typeof jsonwebtoken.sign;
  protected jwtVerify: typeof jsonwebtoken.verify;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
    const jwt = require("jsonwebtoken-esm");
    this.jwtSign = jwt.sign;
    this.jwtVerify = jwt.verify;
  }

  verify(
    token: string,
    secretOrPublicKey: jsonwebtoken.Secret
  ): string | jsonwebtoken.JwtPayload {
    const result = this.jwtVerify(token, secretOrPublicKey);
    return result;
  }
  sign(
    // eslint-disable-next-line @typescript-eslint/ban-types
    payload: string | object | Buffer,
    secretOrPrivateKey: jsonwebtoken.Secret
  ): string {
    const result = this.jwtSign(payload, secretOrPrivateKey);
    return result;
  }
}
