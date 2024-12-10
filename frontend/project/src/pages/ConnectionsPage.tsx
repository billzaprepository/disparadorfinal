import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ConnectionsList } from '../components/Connections/ConnectionsList';
import { CreateConnectionModal } from '../components/Connections/CreateConnectionModal';
import { CircuitBoard } from '../components/CircuitBoard';

export function ConnectionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="relative min-h-screen cyber-gradient p-8">
      <CircuitBoard />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold neon-text">Conexões</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="neon-button rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <Plus size={20} />
            <span>Criar Conexão</span>
          </button>
        </div>

        <div className="bg-black/80 backdrop-blur-sm rounded-lg neon-border">
          <ConnectionsList />
        </div>
      </div>

      <CreateConnectionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}