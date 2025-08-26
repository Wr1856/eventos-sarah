export enum HttpStatusCode {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
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

export const unauthorized = (error: Error): HttpResponse<Error> => ({
  data: error,
  statusCode: HttpStatusCode.Unauthorized,
})

export const serverError = (): HttpResponse => ({
  data: new Error('An unexpected error has occurred'),
  statusCode: HttpStatusCode.ServerError,
})
