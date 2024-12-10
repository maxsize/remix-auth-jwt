import "reflect-metadata";
import { AppLoadContext } from "@remix-run/server-runtime";
import { Strategy } from "remix-auth/src/strategy";
import type { JwtPayload } from "jsonwebtoken";
import { JsonwebtokenService } from "./core/service/jsonwebtoken/JsonwebtokenService.js";
import type { Algorithm } from "jsonwebtoken";
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
export declare class JwtStrategy<User> {
    name: string;
    protected secret: string;
    protected algorithms: Algorithm[];
    protected jwt: JsonwebtokenService;
    protected getToken?: JwtStrategyOptions["getToken"];
    protected verify: Strategy.VerifyFunction<User, JwtStrategyVerifyParams>;
    constructor(options: JwtStrategyOptions, verify: Strategy.VerifyFunction<User, JwtStrategyVerifyParams>);
    authenticate(request: Request): Promise<User>;
}
