import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQRCode } from '../useQRCode';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('useQRCode Integration Tests', () => {
  it('handles network errors during QR code generation', async () => {
    server.use(
      http.post('https://evo.iainfinito.com.br/instance/create', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      try {
        await result.current.generateQRCode('test-instance');
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to create instance. Please try again.');
    expect(result.current.qrCodeData).toBeNull();
  });

  it('handles network errors during QR code update', async () => {
    server.use(
      http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
        return HttpResponse.error();
      })
    );

    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      try {
        await result.current.updateQRCode('test-instance');
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to connect instance. Please try again.');
    expect(result.current.qrCodeData).toBeNull();
  });

  it('handles concurrent requests correctly', async () => {
    const { result } = renderHook(() => useQRCode());

    await act(async () => {
      const promise1 = result.current.generateQRCode('instance-1');
      const promise2 = result.current.generateQRCode('instance-2');
      await Promise.all([promise1, promise2]);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.qrCodeData).toBe('data:image/png;base64,fakeQRCodeData');
  });

  it('maintains loading state during requests', async () => {
    let resolveRequest: (value: unknown) => void;
    server.use(
      http.post('https://evo.iainfinito.com.br/instance/create', () => {
        return new Promise((resolve) => {
          resolveRequest = resolve;
        });
      })
    );

    const { result } = renderHook(() => useQRCode());

    const generatePromise = act(async () => {
      try {
        await result.current.generateQRCode('test-instance');
      } catch (error) {
        // Error is expected
      }
    });

    expect(result.current.loading).toBe(true);

    resolveRequest!(
      HttpResponse.json({
        qrcode: 'data:image/png;base64,fakeQRCodeData',
        status: 'success',
      })
    );

    await generatePromise;

    expect(result.current.loading).toBe(false);
  });
});