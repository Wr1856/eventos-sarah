export enum HttpStatusCode {
  OK = 200,
  BadRequest = 400,
  ServerError = 500,
}

export type HttpResponse<T = any> = {
  statusCode: HttpStatusCode
  data: T
}

export const ok = (data: any): HttpResponse => ({
  data,
  statusCode: HttpStatusCode.OK,
})

export const serverError = (): HttpResponse => ({
  data: new Error('An unexpected erro has ocurred'),
  statusCode: HttpStatusCode.ServerError,
})
