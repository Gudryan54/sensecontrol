/**
 * Erro de domínio/aplicação, com um status HTTP explícito.
 * Lançar um ApiError em qualquer camada do backend (validators,
 * services, routes) faz o middleware de erro central (ver
 * middlewares/errorHandler.ts) devolver esse status e essa mensagem
 * ao cliente, em vez de um genérico "500 Internal Server Error".
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown): ApiError {
    return new ApiError(400, message, details);
  }

  static notFound(message: string): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }
}
