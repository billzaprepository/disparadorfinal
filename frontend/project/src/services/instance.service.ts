import { api } from './api.service';
import { APIError } from '../utils/error';
import { InstanceConfig } from '../types/api';
import { validateInstanceName } from '../utils/validation';

export interface APIResponse {
  status: 'success' | 'error';
  qrcode: string;
  message?: string;
}

export interface ConnectionStateResponse {
  status: 'success' | 'error';
  connected: boolean;
  message?: string;
}

export async function createInstance(
  instanceName: string, 
  config: Partial<InstanceConfig> = {}
): Promise<APIResponse> {
  validateInstanceName(instanceName);

  const response = await api.post<APIResponse>('/instance/create', {
    ...config,
    instanceName: instanceName.trim(),
  });

  return response.data;
}

export async function connectInstance(instanceName: string): Promise<APIResponse> {
  validateInstanceName(instanceName);

  const response = await api.get<APIResponse>(`/instance/connect/${instanceName.trim()}`);
  return response.data;
}

export async function checkConnectionState(instanceName: string): Promise<ConnectionStateResponse> {
  validateInstanceName(instanceName);

  const response = await api.get<ConnectionStateResponse>(
    `/instance/connectionState/${instanceName.trim()}`
  );
  return response.data;
}