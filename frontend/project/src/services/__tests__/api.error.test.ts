import { describe, it, expect, beforeEach } from 'vitest';
import { createInstance, connectInstance } from '../api';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('API Error Handling Tests', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('createInstance error scenarios', () => {
    it('handles server errors with specific status codes', async () => {
      const errorCodes = [500, 502, 503, 504];
      
      for (const statusCode of errorCodes) {
        server.use(
          http.post('https://evo.iainfinito.com.br/instance/create', () => {
            return new HttpResponse(null, { status: statusCode });
          })
        );

        await expect(createInstance('test-instance')).rejects.toThrow(
          'Failed to create instance. Please try again.'
        );
      }
    });

    it('handles malformed response data', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.json({ invalid: 'response' });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('handles empty response body', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, { status: 200 });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('handles request timeout', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve(HttpResponse.error());
            }, 5000);
          });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });

  describe('connectInstance error scenarios', () => {
    it('handles invalid instance state responses', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return HttpResponse.json({ status: 'error', message: 'Instance not found' });
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles rate limiting with retry-after header', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(null, {
            status: 429,
            headers: {
              'Retry-After': '60',
            },
          });
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles connection reset errors', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return HttpResponse.error();
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles invalid QR code data in response', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return HttpResponse.json({
            status: 'success',
            qrcode: 'invalid-qr-code-data',
          });
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });
  });

  describe('API request validation', () => {
    it('validates instance name format', async () => {
      const invalidNames = ['', ' ', 'test/instance', 'test\\instance', 'test?instance'];
      
      for (const invalidName of invalidNames) {
        await expect(createInstance(invalidName)).rejects.toThrow(
          'Failed to create instance. Please try again.'
        );
      }
    });

    it('handles concurrent requests to same instance', async () => {
      const promises = Array(3).fill(null).map(() => createInstance('test-instance'));
      await expect(Promise.all(promises)).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });
});