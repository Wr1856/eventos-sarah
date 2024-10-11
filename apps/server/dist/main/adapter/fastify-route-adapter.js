"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptFastifyRoute = void 0;
const adaptFastifyRoute = controller => async (req, res) => {
    const body = {
        ...req.body,
        ...req.params,
    };
    const { data, statusCode } = await controller.handle(body);
    const json = [200, 201, 204].includes(statusCode)
        ? data
        : { error: data.message };
    return res.status(statusCode).send(json);
};
exports.adaptFastifyRoute = adaptFastifyRoute;
