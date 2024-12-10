import React, { useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Timer } from './Timer';
import { Button } from '../Button';
import { useConnectionState } from '../../hooks/useConnectionState';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  instanceName: string;
  qrCodeData: string | null;
  loading: boolean;
  error: string | null;
  timeLeft: number;
  onTimeout: () => void;
}

export function QRCodeModal({
  isOpen,
  onClose,
  onRefresh,
  instanceName,
  qrCodeData,
  loading,
  error,
  timeLeft,
  onTimeout,
}: QRCodeModalProps) {
  const connectionState = useConnectionState(isOpen ? instanceName : null);

  useEffect(() => {
    if (connectionState.status === 'connected') {
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [connectionState.status, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-black/90 p-8 rounded-lg neon-border max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-orange-500 hover:text-orange-400 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold neon-text mb-6">
          Conectar via QR Code
        </h2>

        <div className="space-y-6">
          {connectionState.status === 'connected' ? (
            <div className="text-green-500 text-center animate-pulse">
              Conexão realizada com sucesso!
            </div>
          ) : error ? (
            <div className="text-red-500 text-center animate-pulse">
              {error}
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-orange-500">Gerando QR Code...</p>
            </div>
          ) : qrCodeData ? (
            <div className="flex flex-col items-center">
              <QRCodeDisplay value={qrCodeData} />
              <div className="mt-4 text-orange-500">
                <Timer duration={timeLeft} onTimeout={onTimeout} />
              </div>
              <p className="mt-2 text-orange-500/80">
                Status: {connectionState.status === 'connecting' ? 'Aguardando conexão...' : 'Desconectado'}
              </p>
            </div>
          ) : null}

          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={onClose}
            >
              Fechar
            </Button>
            <Button
              variant="primary"
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onRefresh}
              disabled={loading || connectionState.status === 'connected'}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              <span>Atualizar QR Code</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}