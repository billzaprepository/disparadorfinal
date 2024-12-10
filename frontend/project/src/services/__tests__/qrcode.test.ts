import { describe, it, expect, beforeEach } from 'vitest';
import { createInstance, connectInstance } from '../api';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('QR Code Service Tests', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('QR Code Generation', () => {
    it('generates valid QR code on instance creation', async () => {
      const response = await createInstance('test-instance');
      expect(response.qrcode).toMatch(/^data:image\/png;base64,/);
      expect(response.status).toBe('success');
    });

    it('handles invalid instance names', async () => {
      const invalidNames = ['', ' ', 'test/instance', 'test\\instance'];
      
      for (const name of invalidNames) {
        await expect(createInstance(name)).rejects.toThrow(
          'Failed to create instance. Please try again.'
        );
      }
    });

    it('handles server errors during QR code generation', async () => {
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

  describe('QR Code Updates', () => {
    it('updates QR code successfully', async () => {
      const response = await connectInstance('test-instance');
      expect(response.qrcode).toMatch(/^data:image\/png;base64,/);
      expect(response.status).toBe('success');
    });

    it('handles non-existent instances', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(connectInstance('non-existent')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles network errors during update', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return HttpResponse.error();
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });
  });

  describe('QR Code Data Validation', () => {
    it('validates QR code format in responses', async () => {
      const createResp = await createInstance('test-instance');
      expect(createResp.qrcode).toMatch(/^data:image\/png;base64,/);

      const connectResp = await connectInstance('test-instance');
      expect(connectResp.qrcode).toMatch(/^data:image\/png;base64,/);
    });

    it('handles malformed QR code data', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.json({
            status: 'success',
            qrcode: 'invalid-qr-data'
          });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });

  describe('Error Recovery', () => {
    it('handles rate limiting', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, {
            status: 429,
            headers: {
              'Retry-After': '1'
            }
          });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('recovers from temporary failures', async () => {
      let attempts = 0;
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          attempts++;
          if (attempts === 1) {
            return HttpResponse.error();
          }
          return HttpResponse.json({
            status: 'success',
            qrcode: 'data:image/png;base64,fakeQRCodeData'
          });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow();
      const response = await createInstance('test-instance');
      expect(response.status).toBe('success');
    });
  });
});