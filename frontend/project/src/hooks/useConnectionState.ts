import { useState, useEffect, useCallback } from 'react';
import { checkConnectionState } from '../services/api';

interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected';
  lastChecked: Date | null;
}

export function useConnectionState(instanceName: string | null) {
  const [state, setState] = useState<ConnectionState>({
    status: 'disconnected',
    lastChecked: null,
  });

  const checkState = useCallback(async () => {
    if (!instanceName) return;

    try {
      const status = await checkConnectionState(instanceName);
      setState({
        status: status.connected ? 'connected' : 'connecting',
        lastChecked: new Date(),
      });
      return status.connected;
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'disconnected',
        lastChecked: new Date(),
      }));
      return false;
    }
  }, [instanceName]);

  useEffect(() => {
    if (!instanceName) {
      setState({
        status: 'disconnected',
        lastChecked: null,
      });
      return;
    }

    const interval = setInterval(checkState, 5000);
    checkState();

    return () => clearInterval(interval);
  }, [instanceName, checkState]);

  return state;
}