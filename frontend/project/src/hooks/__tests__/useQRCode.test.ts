import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQRCode } from '../useQRCode';

describe('useQRCode', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useQRCode());
    
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.qrCodeData).toBeNull();
  });

  it('generates QR code successfully', async () => {
    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      await result.current.generateQRCode('test-instance');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.qrCodeData).toBe('data:image/png;base64,fakeQRCodeData');
  });

  it('updates QR code successfully', async () => {
    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      await result.current.updateQRCode('test-instance');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.qrCodeData).toBe('data:image/png;base64,updatedFakeQRCodeData');
  });

  it('clears QR code state', () => {
    const { result } = renderHook(() => useQRCode());

    act(() => {
      result.current.clearQRCode();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.qrCodeData).toBeNull();
  });
});