import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeDisplay } from '../components/QRCodeGenerator/QRCodeDisplay';
import { QRCodeModal } from '../components/QRCodeGenerator/QRCodeModal';
import { Trash2, Power, QrCode } from 'lucide-react';

export function ConnectionPage() {
  const navigate = useNavigate();
  const [instanceName, setInstanceName] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateQRCode = () => {
    if (!instanceName.trim()) {
      setError('Por favor, insira o nome da instância');
      return;
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleTimeout = () => {
    setIsModalOpen(false);
    setQrCodeData(instanceName); // In a real app, this would be the actual QR code data
  };

  const handleDisconnect = () => {
    if (window.confirm('Tem certeza que deseja desconectar?')) {
      setQrCodeData(null);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja deletar esta instância permanentemente?')) {
      navigate('/welcome');
    }
  };

  return (
    <div className="relative min-h-screen cyber-gradient p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg neon-border p-8">
          <h1 className="text-3xl font-bold neon-text mb-8">Conexão</h1>

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
              <button
                onClick={handleGenerateQRCode}
                className="flex-1 flex items-center justify-center gap-2 neon-button py-2"
              >
                <QrCode size={20} />
                <span>Gerar QR Code</span>
              </button>
            </div>

            {qrCodeData && (
              <div className="mt-8 space-y-6">
                <div className="flex justify-center">
                  <QRCodeDisplay value={qrCodeData} />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleDisconnect}
                    className="flex-1 flex items-center justify-center gap-2 
                             border border-red-500 text-red-500 
                             shadow-[0_0_10px_rgba(239,68,68,0.3)]
                             hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]
                             transition-all duration-300 rounded-lg py-2"
                  >
                    <Power size={20} />
                    <span>Desconectar</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 flex items-center justify-center gap-2 
                             border border-red-500 text-red-500 
                             shadow-[0_0_10px_rgba(239,68,68,0.3)]
                             hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]
                             transition-all duration-300 rounded-lg py-2"
                  >
                    <Trash2 size={20} />
                    <span>Deletar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <QRCodeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTimeout={handleTimeout}
        duration={30}
      />
    </div>
  );
}