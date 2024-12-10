import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';

const handlers = [
  http.post('https://evo.iainfinito.com.br/instance/create', async () => {
    return HttpResponse.json({
      qrcode: 'data:image/png;base64,fakeQRCodeData',
      status: 'success',
    });
  }),

  http.get('https://evo.iainfinito.com.br/instance/connect/:instance', async () => {
    return HttpResponse.json({
      qrcode: 'data:image/png;base64,updatedFakeQRCodeData',
      status: 'success',
    });
  }),
];

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());