"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const http_1 = require("../helpers/http");
class LoginController {
    authentication;
    constructor(authentication) {
        this.authentication = authentication;
    }
    async handle({ email, password }) {
        try {
            const data = await this.authentication({ email, password });
            return (0, http_1.ok)(data);
        }
        catch (error) {
            return (0, http_1.serverError)();
        }
    }
}
exports.LoginController = LoginController;
