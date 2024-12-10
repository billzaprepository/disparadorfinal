import { describe, it, expect, beforeEach } from 'vitest';
import { createInstance, connectInstance } from '../api';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('API Connection Tests', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('Connection Flow', () => {
    it('successfully creates and connects instance', async () => {
      // Create instance
      const createResponse = await createInstance('test-instance');
      expect(createResponse.qrcode).toBe('data:image/png;base64,fakeQRCodeData');
      expect(createResponse.status).toBe('success');

      // Connect instance
      const connectResponse = await connectInstance('test-instance');
      expect(connectResponse.qrcode).toBe('data:image/png;base64,updatedFakeQRCodeData');
      expect(connectResponse.status).toBe('success');
    });

    it('handles instance already exists error', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(
            JSON.stringify({
              status: 'error',
              message: 'Instance already exists'
            }),
            { status: 409 }
          );
        })
      );

      await expect(createInstance('existing-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('handles instance not found during connection', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(
            JSON.stringify({
              status: 'error',
              message: 'Instance not found'
            }),
            { status: 404 }
          );
        })
      );

      await expect(connectInstance('non-existent-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles API authentication errors', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });

  describe('QR Code Validation', () => {
    it('validates QR code format in create response', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.json({
            status: 'success',
            qrcode: 'data:image/png;base64,validQRCodeData'
          });
        })
      );

      const response = await createInstance('test-instance');
      expect(response.qrcode).toMatch(/^data:image\/png;base64,/);
    });

    it('validates QR code format in connect response', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return HttpResponse.json({
            status: 'success',
            qrcode: 'data:image/png;base64,validQRCodeData'
          });
        })
      );

      const response = await connectInstance('test-instance');
      expect(response.qrcode).toMatch(/^data:image\/png;base64,/);
    });
  });

  describe('Instance Name Validation', () => {
    it('validates instance name format', async () => {
      const invalidNames = [
        '',
        ' ',
        'test/instance',
        'test\\instance',
        'test?instance',
        'test#instance',
        'test&instance'
      ];

      for (const invalidName of invalidNames) {
        await expect(createInstance(invalidName)).rejects.toThrow(
          'Failed to create instance. Please try again.'
        );
      }
    });

    it('handles special characters in instance name', async () => {
      const validNames = [
        'test-instance',
        'test_instance',
        'test.instance',
        'test123'
      ];

      for (const validName of validNames) {
        const response = await createInstance(validName);
        expect(response.status).toBe('success');
      }
    });
  });

  describe('Error Recovery', () => {
    it('recovers from temporary connection issues', async () => {
      // First request fails
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.error();
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow();

      // Second request succeeds
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.json({
            status: 'success',
            qrcode: 'data:image/png;base64,fakeQRCodeData'
          });
        })
      );

      const response = await createInstance('test-instance');
      expect(response.status).toBe('success');
    });

    it('handles rate limiting with exponential backoff', async () => {
      let attempts = 0;
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          attempts++;
          if (attempts <= 2) {
            return new HttpResponse(null, {
              status: 429,
              headers: {
                'Retry-After': '1'
              }
            });
          }
          return HttpResponse.json({
            status: 'success',
            qrcode: 'data:image/png;base64,fakeQRCodeData'
          });
        })
      );

      const response = await createInstance('test-instance');
      expect(response.status).toBe('success');
      expect(attempts).toBe(3);
    });
  });
});