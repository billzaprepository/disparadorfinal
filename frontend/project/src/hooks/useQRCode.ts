import { useState, useCallback } from 'react';
import { createInstance, connectInstance, APIResponse } from '../services/api';
import { APIError } from '../utils/error';

interface QRCodeState {
  loading: boolean;
  error: string | null;
  qrCodeData: string | null;
  instanceData: APIResponse | null;
}

export function useQRCode() {
  const [state, setState] = useState<QRCodeState>({
    loading: false,
    error: null,
    qrCodeData: null,
    instanceData: null,
  });

  const generateQRCode = useCallback(async (instanceName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await createInstance(instanceName);
      
      setState(prev => ({
        ...prev,
        loading: false,
        qrCodeData: response.qrcode?.base64 || null,
        instanceData: response,
      }));
      
      return response.qrcode?.base64 || null;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof APIError ? error.message : 'Erro inesperado ao gerar QR Code',
      }));
      throw error;
    }
  }, []);

  const updateQRCode = useCallback(async (instanceName: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await connectInstance(instanceName);
      
      setState(prev => ({
        ...prev,
        loading: false,
        qrCodeData: response.qrcode?.base64 || null,
        instanceData: response,
      }));
      
      return response.qrcode?.base64 || null;
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof APIError ? error.message : 'Erro inesperado ao atualizar QR Code',
      }));
      throw error;
    }
  }, []);

  const clearQRCode = useCallback(() => {
    setState({
      loading: false,
      error: null,
      qrCodeData: null,
      instanceData: null,
    });
  }, []);

  return {
    ...state,
    generateQRCode,
    updateQRCode,
    clearQRCode,
  };
}