import React from 'react';
import { useAuthContext } from '../context/AuthContext';
import { CircuitBoard } from '../components/CircuitBoard';
import { Terminal } from 'lucide-react';

export function WelcomePage() {
  const { username } = useAuthContext();

  return (
    <div className="relative min-h-screen cyber-gradient p-8">
      <CircuitBoard />
      <div className="relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg neon-border p-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Terminal className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold neon-text animate-glow">
                Bem-vindo, {username}
              </h1>
            </div>
            <p className="text-center text-orange-500/80">
              Sistema inicializado com sucesso. Pronto para operação.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}