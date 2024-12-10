import { AxiosError } from 'axios';

export class APIError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown): never {
  console.error('Handling API error:', error);

  if (error instanceof APIError) {
    throw error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        throw new APIError(message || 'Requisição inválida. Verifique os dados enviados.');
      case 401:
        throw new APIError('Não autorizado. Verifique sua chave de API.');
      case 404:
        throw new APIError('Instância não encontrada.');
      case 409:
        throw new APIError('Instância já existe.');
      case 429:
        throw new APIError('Muitas requisições. Tente novamente em alguns segundos.');
      case 500:
      case 502:
      case 503:
      case 504:
        throw new APIError('Erro no servidor. Tente novamente mais tarde.');
      default:
        throw new APIError(message || 'Ocorreu um erro inesperado.');
    }
  }

  throw new APIError('Ocorreu um erro inesperado.');
}