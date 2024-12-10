import React from 'react';
import { useNavigate } from 'react-router-dom';

const connections = [
  { id: 1, name: 'Conexão 1', status: 'online' },
  { id: 2, name: 'Conexão 2', status: 'offline' },
  { id: 3, name: 'Conexão 3', status: 'online' },
];

export function ConnectionsList() {
  const navigate = useNavigate();

  return (
    <div className="space-y-1">
      {connections.map((connection) => (
        <button
          key={connection.id}
          onClick={() => navigate(`/connections/${connection.id}`)}
          className="w-full flex items-center gap-2 px-4 py-2 text-orange-500 
                   hover:bg-orange-500/10 transition-colors"
        >
          <span className={`w-2 h-2 rounded-full ${
            connection.status === 'online' 
              ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
              : 'bg-gray-500'
          }`} />
          <span>{connection.name}</span>
        </button>
      ))}
    </div>
  );
}