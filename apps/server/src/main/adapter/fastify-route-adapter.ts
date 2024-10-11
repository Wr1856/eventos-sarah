import type { RouteHandler } from 'fastify'

import type { Controller } from '../../application/contracts/controller'

type Adapt = (controller: Controller) => RouteHandler

export const adaptFastifyRoute: Adapt = controller => async (req, res) => {
  const body = {
    ...(req.body as any),
    ...(req.params as any),
  }

  const { data, statusCode } = await controller.handle(body)
  const json = [200, 201, 204].includes(statusCode)
    ? data
    : { error: data.message }

  return res.status(statusCode).send(json)
}
