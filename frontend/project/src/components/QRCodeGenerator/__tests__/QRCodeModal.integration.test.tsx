import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import { QRCodeModal } from '../QRCodeModal';
import { server } from '../../../test/setup';
import { HttpResponse, http } from 'msw';

describe('QRCodeModal Integration Tests', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onTimeout: vi.fn(),
    duration: 30,
    instanceName: 'test-instance',
    qrCodeData: 'data:image/png;base64,fakeQRCodeData',
    loading: false,
    error: null,
    onUpdate: vi.fn(),
  };

  it('handles failed QR code updates gracefully', async () => {
    server.use(
      http.get('https://evo.iainfinito.com.br/instance/connect/:instance', () => {
        return HttpResponse.error();
      })
    );

    const onUpdate = vi.fn().mockRejectedValue(new Error('Update failed'));
    render(<QRCodeModal {...defaultProps} duration={1} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('test-instance');
    }, { timeout: 2000 });
  });

  it('updates QR code periodically', async () => {
    const onUpdate = vi.fn().mockResolvedValue(undefined);
    render(<QRCodeModal {...defaultProps} duration={1} onUpdate={onUpdate} />);

    // First update
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('test-instance');
    }, { timeout: 2000 });

    // Second update
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledTimes(2);
    }, { timeout: 2000 });
  });

  it('cleans up timer on unmount', async () => {
    const onUpdate = vi.fn();
    const { unmount } = render(
      <QRCodeModal {...defaultProps} duration={1} onUpdate={onUpdate} />
    );

    unmount();

    // Wait to ensure no updates are called after unmount
    await new Promise((resolve) => setTimeout(resolve, 2000));
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('displays loading state during updates', async () => {
    let resolveUpdate: (value: unknown) => void;
    const onUpdate = vi.fn().mockImplementation(() => {
      return new Promise((resolve) => {
        resolveUpdate = resolve;
      });
    });

    render(<QRCodeModal {...defaultProps} duration={1} onUpdate={onUpdate} />);

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('test-instance');
    }, { timeout: 2000 });

    resolveUpdate!(undefined);
  });
});