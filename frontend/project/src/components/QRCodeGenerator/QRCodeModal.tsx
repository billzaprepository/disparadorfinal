import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Timer } from './Timer';
import { QRCodeDisplay } from './QRCodeDisplay';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTimeout: () => void;
  duration: number;
  instanceName: string;
  qrCodeData?: string;
  loading?: boolean;
  error?: string | null;
  onUpdate: (instanceName: string) => Promise<void>;
}

export function QRCodeModal({ 
  isOpen, 
  onClose, 
  onTimeout, 
  duration,
  instanceName,
  qrCodeData,
  loading,
  error,
  onUpdate,
}: QRCodeModalProps) {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isOpen && qrCodeData) {
      timeoutId = setTimeout(async () => {
        try {
          await onUpdate(instanceName);
        } catch (error) {
          // Error handling is managed by the hook
        }
      }, duration * 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOpen, qrCodeData, duration, instanceName, onUpdate]);

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
        
        <div className="text-center">
          <h3 className="text-2xl font-bold neon-text mb-6">
            {loading ? 'Gerando QR Code' : error ? 'Erro' : 'QR Code Gerado'}
          </h3>
          
          {error ? (
            <p className="text-red-500 animate-pulse mb-6">{error}</p>
          ) : loading ? (
            <div className="mb-6">
              <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-orange-500/80 mt-4">
                Aguarde enquanto geramos seu QR Code...
              </p>
            </div>
          ) : qrCodeData ? (
            <div className="mb-6">
              <QRCodeDisplay value={qrCodeData} />
              <p className="text-orange-500/80 mt-4">
                QR Code será atualizado em:
              </p>
              <Timer duration={duration} onTimeout={onTimeout} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}