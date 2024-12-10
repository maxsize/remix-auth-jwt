import "reflect-metadata";
import { AppLoadContext } from "@remix-run/server-runtime";
// import * as jwt from "jsonwebtoken-esm";
import type { JwtPayload } from "jsonwebtoken";
import { JsonwebtokenService } from "./core/service/jsonwebtoken/JsonwebtokenService.js";
import { container } from "tsyringe";
import { jsonwebtokenModule } from "./core/service/di/JsonwebtokenModule.js";
import type { Algorithm } from "jsonwebtoken";

export type VerifyFunction<User, VerifyParams> = (
  params: VerifyParams,
) => Promise<User>;

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

export class JwtStrategy<User> {
  name = "jwt";

  protected secret: string;
  protected algorithms: Algorithm[];
  protected jwt: JsonwebtokenService;
  protected getToken?: JwtStrategyOptions["getToken"];
  public verify: VerifyFunction<User, JwtStrategyVerifyParams>

  constructor(
    options: JwtStrategyOptions,
    verify: VerifyFunction<User, JwtStrategyVerifyParams>
  ) {
    // super(verify);
    this.verify = verify;
    this.secret = options.secret;
    this.algorithms = options.algorithms;
    this.jwt = container.resolve<JsonwebtokenService>("JsonwebtokenService");

    if (options.getToken) {
      this.getToken = options.getToken;
    }
  }

  public async authenticate(request: Request): Promise<User> {
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
