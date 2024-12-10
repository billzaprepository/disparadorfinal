import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials } from '../types/auth';
import { Lock, User } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => Promise<boolean>;
  error: string | null;
}

export function LoginForm({ onLogin, error }: LoginFormProps) {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(credentials);
    if (success) {
      navigate('/welcome');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      <div className="space-y-4">
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            placeholder="Digite seu nome de usuário"
            className="w-full pl-10 pr-4 py-2 bg-black/50 text-orange-500 placeholder-orange-500/50 
                     rounded-lg neon-border focus:outline-none focus:border-orange-400 
                     focus:shadow-[0_0_15px_rgba(255,165,0,0.5)]"
            required
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-500" size={20} />
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            placeholder="Digite sua senha"
            className="w-full pl-10 pr-4 py-2 bg-black/50 text-orange-500 placeholder-orange-500/50 
                     rounded-lg neon-border focus:outline-none focus:border-orange-400 
                     focus:shadow-[0_0_15px_rgba(255,165,0,0.5)]"
            required
          />
        </div>
      </div>
      {error && (
        <div className="text-red-500 text-sm text-center animate-pulse">{error}</div>
      )}
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-lg neon-button font-medium"
      >
        Entrar
      </button>
    </form>
  );
}