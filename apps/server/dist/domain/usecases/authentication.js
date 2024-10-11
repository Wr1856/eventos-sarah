"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAuthentication = void 0;
const setupAuthentication = (userAccountRepo, hashComparer) => async (input) => {
    const user = await userAccountRepo.findByEmail(input);
    if (user) {
        const isValid = await hashComparer.compare(input.password, user.password);
        if (isValid) {
            return {
                loggedIn: true,
                name: user.name,
                email: user.email,
                id: user.id,
                role: user.role
            };
        }
    }
    throw new Error("The data provided is invalid.");
};
exports.setupAuthentication = setupAuthentication;
