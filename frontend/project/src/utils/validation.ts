import { APIError } from './error';

export function validateInstanceName(instanceName: string | undefined | null): void {
  if (!instanceName?.trim()) {
    throw new APIError('Nome da instância é obrigatório');
  }

  const trimmedName = instanceName.trim();
  const validNameRegex = /^[a-zA-Z0-9._-]+$/;

  if (!validNameRegex.test(trimmedName)) {
    throw new APIError(
      'Nome da instância deve conter apenas letras, números, pontos, hífens e underscores'
    );
  }

  if (trimmedName.length < 3 || trimmedName.length > 32) {
    throw new APIError('Nome da instância deve ter entre 3 e 32 caracteres');
  }
}

export function validateQRCode(qrcode: string | undefined | null): void {
  if (!qrcode?.startsWith('data:image/png;base64,')) {
    throw new APIError('Formato de QR code inválido recebido do servidor');
  }
}