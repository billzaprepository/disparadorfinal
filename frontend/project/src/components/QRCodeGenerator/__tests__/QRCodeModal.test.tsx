import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../test/utils';
import { QRCodeModal } from '../QRCodeModal';

describe('QRCodeModal', () => {
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

  it('renders loading state correctly', () => {
    render(<QRCodeModal {...defaultProps} loading={true} />);
    expect(screen.getByText('Gerando QR Code')).toBeInTheDocument();
    expect(screen.getByText('Aguarde enquanto geramos seu QR Code...')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    const error = 'Failed to generate QR code';
    render(<QRCodeModal {...defaultProps} error={error} />);
    expect(screen.getByText('Erro')).toBeInTheDocument();
    expect(screen.getByText(error)).toBeInTheDocument();
  });

  it('renders QR code when data is provided', () => {
    render(<QRCodeModal {...defaultProps} />);
    expect(screen.getByText('QR Code Gerado')).toBeInTheDocument();
    expect(screen.getByText('QR Code será atualizado em:')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<QRCodeModal {...defaultProps} onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalled();
  });

  it('updates QR code after duration', async () => {
    const onUpdate = vi.fn();
    render(<QRCodeModal {...defaultProps} duration={1} onUpdate={onUpdate} />);
    
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith('test-instance');
    }, { timeout: 2000 });
  });
});