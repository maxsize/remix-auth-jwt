"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonwebtokenModule = jsonwebtokenModule;
const tsyringe_1 = require("tsyringe");
const JsonwebtokenEsmServiceImpl_1 = require("../jsonwebtoken/impl/JsonwebtokenEsmServiceImpl");
const JsonwebtokenServiceImpl_1 = require("../jsonwebtoken/impl/JsonwebtokenServiceImpl");
function jsonwebtokenModule() {
    if (typeof process !== "undefined" &&
        process.versions &&
        process.versions.node) {
        tsyringe_1.container.register("JsonwebtokenService", {
            useClass: JsonwebtokenServiceImpl_1.JsonwebtokenServiceImpl,
        });
    }
    else {
        tsyringe_1.container.register("JsonwebtokenService", {
            useClass: JsonwebtokenEsmServiceImpl_1.JsonwebtokenEsmServiceImpl,
        });
    }
}
