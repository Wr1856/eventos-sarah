import type { Authentication } from '../../domain/usecases/authentication'
import type { Controller } from '../contracts/controller'
import { ok, serverError, type HttpResponse } from '../helpers/http'

type Request = {
  email: string
  password: string
}

export class LoginController implements Controller {
  constructor(private readonly authentication: Authentication) {}
  async handle({ email, password }: Request): Promise<HttpResponse> {
    try {
      const data = await this.authentication({ email, password })
      return ok(data)
    } catch (error) {
      return serverError()
    }
  }
}
