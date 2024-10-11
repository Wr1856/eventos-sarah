"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptAdapt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class BcryptAdapt {
    salt;
    constructor(salt) {
        this.salt = salt;
    }
    async hash(plaintext) {
        const digest = await bcrypt_1.default.hash(plaintext, this.salt);
        return digest;
    }
    async compare(plaintext, digest) {
        const isValid = await bcrypt_1.default.compare(plaintext, digest);
        return isValid;
    }
}
exports.BcryptAdapt = BcryptAdapt;
