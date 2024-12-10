import axios from 'axios';
import { API_BASE_URL, API_HEADERS } from '../config/api';
import { handleAPIError, APIError } from '../utils/error';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: API_HEADERS,
  timeout: 30000,
});

export interface APIResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    webhook_wa_business: string | null;
    access_token_wa_business: string;
    status: string;
  };
  hash: {
    apikey: string;
  };
  settings: {
    reject_call: boolean;
    msg_call: string;
    groups_ignore: boolean;
    always_online: boolean;
    read_messages: boolean;
    read_status: boolean;
    sync_full_history: boolean;
  };
  qrcode?: {
    base64: string;
  };
}

export async function createInstance(instanceName: string): Promise<APIResponse> {
  if (!instanceName?.trim()) {
    throw new APIError('Nome da instância é obrigatório');
  }

  try {
    const response = await api.post<APIResponse>('/instance/create', {
      instanceName: instanceName.trim(),
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS'
    });

    console.log('Create instance response:', response.data);

    if (!response.data.qrcode?.base64?.startsWith('data:image/png;base64,')) {
      console.error('Invalid QR code format:', response.data.qrcode);
      throw new APIError('Formato de QR code inválido recebido');
    }

    return response.data;
  } catch (error) {
    console.error('Error in createInstance:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw handleAPIError(error);
  }
}

export async function connectInstance(instanceName: string): Promise<APIResponse> {
  if (!instanceName?.trim()) {
    throw new APIError('Nome da instância é obrigatório');
  }

  try {
    const response = await api.get<APIResponse>(`/instance/connect/${instanceName.trim()}`);
    
    console.log('Connect instance response:', response.data);

    if (!response.data.qrcode?.base64?.startsWith('data:image/png;base64,')) {
      console.error('Invalid QR code format:', response.data.qrcode);
      throw new APIError('Formato de QR code inválido recebido');
    }

    return response.data;
  } catch (error) {
    console.error('Error in connectInstance:', error);
    if (error instanceof APIError) {
      throw error;
    }
    throw handleAPIError(error);
  }
}