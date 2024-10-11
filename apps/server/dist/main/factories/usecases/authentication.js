"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAuthentication = void 0;
const authentication_1 = require("../../../domain/usecases/authentication");
const bcrypt_adapt_1 = require("../cryptography/bcrypt-adapt");
const user_account_1 = require("../repositories/user-account");
const makeAuthentication = () => {
    return (0, authentication_1.setupAuthentication)((0, user_account_1.makePgUserAccountRepository)(), (0, bcrypt_adapt_1.makeBcryptAdapter)());
};
exports.makeAuthentication = makeAuthentication;
