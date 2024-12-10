import "reflect-metadata";
import { AppLoadContext } from "@remix-run/server-runtime";
import { Strategy } from 'remix-auth/strategy';
import type { JwtPayload } from "jsonwebtoken";
import type { Algorithm } from "jsonwebtoken";
import { container } from "tsyringe";
import * as jwt from "jsonwebtoken";
import type * as jsonwebtoken from "jsonwebtoken";

interface JsonwebtokenService {
  verify(
    token: string,
    secretOrPublicKey: jwt.Secret,
    options?: {
      algorithms?: jwt.Algorithm[];
    }
  ): string | jwt.JwtPayload;
  sign(
    payload: string | object | Buffer,
    secretOrPrivateKey: jwt.Secret
  ): string;
}

class JsonwebtokenServiceImpl implements JsonwebtokenService {
  protected jwtSign: typeof jsonwebtoken.sign;
  protected jwtVerify: typeof jsonwebtoken.verify;
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, unicorn/prefer-module
    const jwt = require("jsonwebtoken");
    this.jwtSign = jwt.sign;
    this.jwtVerify = jwt.verify;
  }

  verify(
    token: string,
    secretOrPublicKey: jsonwebtoken.Secret,
    options: {
      algorithms?: jsonwebtoken.Algorithm[];
    }
  ): string | jsonwebtoken.JwtPayload {
    const result = this.jwtVerify(token, secretOrPublicKey, options);
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

class JsonwebtokenEsmServiceImpl implements JsonwebtokenService {
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
    secretOrPublicKey: jsonwebtoken.Secret,
    options: {
      algorithms?: jsonwebtoken.Algorithm[];
    }
  ): string | jsonwebtoken.JwtPayload {
    const result = this.jwtVerify(token, secretOrPublicKey, options);
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

function jsonwebtokenModule() {
  if (
    typeof process !== "undefined" &&
    process.versions &&
    process.versions.node
  ) {
    container.register<JsonwebtokenService>("JsonwebtokenService", {
      useClass: JsonwebtokenServiceImpl,
    });
  } else {
    container.register<JsonwebtokenService>("JsonwebtokenService", {
      useClass: JsonwebtokenEsmServiceImpl,
    });
  }
}

jsonwebtokenModule();

/**
 * This interface declares what configuration the strategy needs from the
 * developer to correctly work.
 */
export interface JwtStrategyOptions {
  /**
   * The key to verify the JWT
   */
  secret: string;

  /**
   * The algorithms to verify the JWT
   */
  algorithms: Algorithm[];

  getToken?: (req: Request) => string | undefined | Promise<string | undefined>;
}

/**
 * This interface declares what the developer will receive from the strategy
 * to verify the user identity in their system.
 */
export interface JwtStrategyVerifyParams {
  context?: AppLoadContext;
  payload: string | JwtPayload;
}

export class JwtStrategy<User> extends Strategy<User, JwtStrategyVerifyParams> {
  name = "jwt";

  protected secret: string;
  protected algorithms: Algorithm[];
  protected jwt: JsonwebtokenService;
  protected getToken?: JwtStrategyOptions["getToken"];
  // public verify: VerifyFunction<User, JwtStrategyVerifyParams>

  constructor(
    options: JwtStrategyOptions,
    verify: Strategy.VerifyFunction<User, JwtStrategyVerifyParams>
  ) {
    super(verify);
    // this.verify = verify;
    this.secret = options.secret;
    this.algorithms = options.algorithms;
    this.jwt = container.resolve<JsonwebtokenService>("JsonwebtokenService");

    if (options.getToken) {
      this.getToken = options.getToken;
    }
  }

  override async authenticate(request: Request): Promise<User> {
    let token: string | undefined;
    try {
      token = this.getToken
        ? await this.getToken(request)
        : request.headers.get("Authorization")?.split(" ")[1];

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
    } catch (error: unknown) {
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
