"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePgUserAccountRepository = void 0;
const user_repository_1 = require("../../../infra/repos/postgres/user-repository");
const makePgUserAccountRepository = () => {
    return new user_repository_1.PgUserAccountRepository();
};
exports.makePgUserAccountRepository = makePgUserAccountRepository;
