import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConnections } from '../../hooks/useConnections';

export function ConnectionsList() {
  const navigate = useNavigate();
  const { connections } = useConnections();

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <p className="text-orange-500/80 text-center animate-glow mb-2">
          Nenhuma conexão criada.
        </p>
        <p className="text-orange-500/60 text-center text-sm">
          Clique em 'Criar Conexão' para adicionar uma nova instância.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-orange-500/20">
      {connections.map((connection) => (
        <button
          key={connection.id}
          onClick={() => navigate(`/connections/${connection.id}`)}
          className="w-full px-6 py-4 flex items-center gap-4 hover:bg-orange-500/5 transition-colors"
        >
          <span
            className={`w-3 h-3 rounded-full ${
              connection.status === 'online'
                ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                : 'bg-gray-500'
            }`}
          />
          <div className="flex-1 text-left">
            <h3 className="text-orange-500 font-medium">{connection.name}</h3>
            {connection.lastActive && (
              <p className="text-sm text-orange-500/60">
                Última atividade: {new Date(connection.lastActive).toLocaleString()}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}