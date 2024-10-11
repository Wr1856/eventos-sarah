import type { HttpResponse } from '../helpers/http'

export type Controller = {
  handle: (httpRequest: any) => Promise<HttpResponse>
}
