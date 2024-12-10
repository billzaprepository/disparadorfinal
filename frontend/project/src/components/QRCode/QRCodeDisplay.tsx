import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 256 }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg inline-block neon-border">
      <QRCodeSVG
        value={value}
        size={size}
        level="H"
        includeMargin
        className="mx-auto"
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}