"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginController = void 0;
const login_controller_1 = require("../../../application/controllers/login-controller");
const authentication_1 = require("../usecases/authentication");
const makeLoginController = () => {
    return new login_controller_1.LoginController((0, authentication_1.makeAuthentication)());
};
exports.makeLoginController = makeLoginController;
