import { describe, it, expect, beforeEach } from 'vitest';
import { createInstance, connectInstance } from '../api';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('API Service', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('createInstance', () => {
    it('creates instance successfully', async () => {
      const response = await createInstance('test-instance');
      expect(response.qrcode).toBe('data:image/png;base64,fakeQRCodeData');
      expect(response.status).toBe('success');
    });

    it('handles creation error', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });

  describe('connectInstance', () => {
    it('connects instance successfully', async () => {
      const response = await connectInstance('test-instance');
      expect(response.qrcode).toBe('data:image/png;base64,updatedFakeQRCodeData');
      expect(response.status).toBe('success');
    });

    it('handles connection error', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });
  });
});