import { describe, it, expect, beforeEach } from 'vitest';
import { createInstance, connectInstance } from '../api';
import { server } from '../../test/setup';
import { HttpResponse, http } from 'msw';

describe('API Integration Tests', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('createInstance', () => {
    it('handles network errors gracefully', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return HttpResponse.error();
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('handles invalid API key', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });

    it('handles rate limiting', async () => {
      server.use(
        http.post('https://evo.iainfinito.com.br/instance/create', () => {
          return new HttpResponse(null, { status: 429 });
        })
      );

      await expect(createInstance('test-instance')).rejects.toThrow(
        'Failed to create instance. Please try again.'
      );
    });
  });

  describe('connectInstance', () => {
    it('handles timeout errors', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(null, { status: 408 });
        })
      );

      await expect(connectInstance('test-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });

    it('handles invalid instance name', async () => {
      server.use(
        http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(connectInstance('invalid-instance')).rejects.toThrow(
        'Failed to connect instance. Please try again.'
      );
    });
  });
});