import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { CircuitBoard } from '../components/CircuitBoard';

export function AppLayout() {
  const { isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen cyber-gradient">
      <CircuitBoard />
      <Sidebar />
      <main className="relative z-10 flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}