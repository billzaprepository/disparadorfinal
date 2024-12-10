import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { useAuthContext } from '../context/AuthContext';
import { CircuitBoard } from '../components/CircuitBoard';

export function LoginPage() {
  const { login, error } = useAuthContext();

  return (
    <div className="relative min-h-screen cyber-gradient flex flex-col items-center justify-center p-4 overflow-hidden">
      <CircuitBoard />
      <div className="relative z-10 w-full max-w-sm">
        <h1 className="text-4xl font-bold text-center neon-text mb-8 animate-glow">
          LOGIN
        </h1>
        <div className="bg-black/80 backdrop-blur-sm p-8 rounded-lg neon-border">
          <LoginForm onLogin={login} error={error} />
        </div>
      </div>
    </div>
  );
}