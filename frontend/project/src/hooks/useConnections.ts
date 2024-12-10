import { create } from 'zustand';

interface Connection {
  id: number;
  name: string;
  status: 'online' | 'offline';
  lastActive?: string;
}

interface ConnectionsState {
  connections: Connection[];
  addConnection: (name: string) => void;
  removeConnection: (id: number) => void;
  updateConnectionStatus: (id: number, status: 'online' | 'offline') => void;
}

export const useConnections = create<ConnectionsState>((set) => ({
  connections: [],
  addConnection: (name) =>
    set((state) => ({
      connections: [
        ...state.connections,
        {
          id: Date.now(),
          name,
          status: 'online',
          lastActive: new Date().toISOString(),
        },
      ],
    })),
  removeConnection: (id) =>
    set((state) => ({
      connections: state.connections.filter((conn) => conn.id !== id),
    })),
  updateConnectionStatus: (id, status) =>
    set((state) => ({
      connections: state.connections.map((conn) =>
        conn.id === id
          ? { ...conn, status, lastActive: new Date().toISOString() }
          : conn
      ),
    })),
}));