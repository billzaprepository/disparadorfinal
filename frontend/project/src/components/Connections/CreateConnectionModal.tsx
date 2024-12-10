import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useQRCode } from '../../hooks/useQRCode';
import { QRCodeModal } from '../QRCode';
import { Button } from '../Button';

interface CreateConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateConnectionModal({ isOpen, onClose }: CreateConnectionModalProps) {
  const [instanceName, setInstanceName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const { qrCodeData, loading, error: qrError, generateQRCode, updateQRCode, clearQRCode } = useQRCode();

  const handleGenerateQRCode = async () => {
    if (!instanceName.trim()) {
      setError('Por favor, insira o nome da instância');
      return;
    }
    setError(null);
    try {
      await generateQRCode(instanceName.trim());
      setIsQRModalOpen(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao gerar QR Code');
    }
  };

  const handleRefreshQRCode = async () => {
    try {
      await updateQRCode(instanceName);
    } catch (error) {
      // Error handling is managed by the hook
    }
  };

  const handleClose = () => {
    setInstanceName('');
    setError(null);
    clearQRCode();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
        <div className="relative z-10 bg-black/90 p-8 rounded-lg neon-border max-w-md w-full mx-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-orange-500 hover:text-orange-400 transition-colors"
          >
            <X size={24} />
          </button>

          <h2 className="text-2xl font-bold neon-text mb-6">Nova Conexão</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="instanceName" className="block text-orange-500 mb-2">
                Nome da Instância
              </label>
              <input
                id="instanceName"
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                placeholder="Digite o nome da instância"
                className="w-full pl-4 pr-4 py-2 bg-black/50 text-orange-500 
                         placeholder-orange-500/50 rounded-lg neon-border 
                         focus:outline-none focus:border-orange-400 
                         focus:shadow-[0_0_15px_rgba(255,165,0,0.5)]"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 animate-pulse">{error}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateQRCode}
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Gerando...' : 'Gerar QR Code'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={isQRModalOpen}
        onClose={() => {
          setIsQRModalOpen(false);
          clearQRCode();
        }}
        onRefresh={handleRefreshQRCode}
        instanceName={instanceName}
        qrCodeData={qrCodeData}
        loading={loading}
        error={qrError}
        timeLeft={30}
        onTimeout={handleRefreshQRCode}
      />
    </>
  );
}