import { LoginController } from '../../../application/controllers/login-controller'
import { makeAuthentication } from '../usecases/authentication'

export const makeLoginController = (): LoginController => {
  return new LoginController(makeAuthentication())
}
