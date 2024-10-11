"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBcryptAdapter = void 0;
const bcrypt_adapt_1 = require("../../../infra/gateways/bcrypt-adapt");
const makeBcryptAdapter = () => {
    const salt = 12;
    return new bcrypt_adapt_1.BcryptAdapt(salt);
};
exports.makeBcryptAdapter = makeBcryptAdapter;
