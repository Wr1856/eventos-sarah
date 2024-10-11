"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverError = exports.ok = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["BadRequest"] = 400] = "BadRequest";
    HttpStatusCode[HttpStatusCode["ServerError"] = 500] = "ServerError";
})(HttpStatusCode || (exports.HttpStatusCode = HttpStatusCode = {}));
const ok = (data) => ({
    data,
    statusCode: HttpStatusCode.OK,
});
exports.ok = ok;
const serverError = () => ({
    data: new Error('An unexpected erro has ocurred'),
    statusCode: HttpStatusCode.OK,
});
exports.serverError = serverError;
