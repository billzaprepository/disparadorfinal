import { useState, useEffect, useCallback } from 'react';

interface QRCodeTimerState {
  timeLeft: number;
  progress: number;
}

export function useQRCodeTimer(duration: number, onTimeout: () => void): QRCodeTimerState {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  const progress = (timeLeft / duration) * 100;

  return { timeLeft, progress };
}