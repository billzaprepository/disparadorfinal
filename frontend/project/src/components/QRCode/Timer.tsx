import React from 'react';
import { useQRCodeTimer } from '../../hooks/useQRCodeTimer';

interface TimerProps {
  duration: number;
  onTimeout: () => void;
}

export function Timer({ duration, onTimeout }: TimerProps) {
  const { timeLeft, progress } = useQRCodeTimer(duration, onTimeout);
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference * (1 - progress / 100);

  return (
    <div className="relative">
      <div className="w-32 h-32 mx-auto relative">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="8"
          />
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="#FFA500"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(255,165,0,0.5))',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-bold neon-text animate-pulse-slow">
            {timeLeft}
          </span>
        </div>
      </div>
      <p className="text-center mt-2 text-orange-500/80">
        Atualizando em {timeLeft} segundos
      </p>
    </div>
  );
}