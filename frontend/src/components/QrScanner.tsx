import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export const QrScanner = ({ onScanSuccess, onClose }: QrScannerProps) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isClosing = useRef(false);

  const closeScanner = () => {
    if (isClosing.current) return;
    isClosing.current = true;

    const cleanup = () => {
      if (scannerRef.current) {
        Promise.resolve(scannerRef.current.clear()).catch(console.warn);
      }
      onClose();
    };

    if (scannerRef.current) {
      Promise.resolve(scannerRef.current.stop())
        .catch(console.warn)
        .finally(cleanup);
    } else {
      cleanup();
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode('qr-reader');
    scannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (isClosing.current) return;
          isClosing.current = true;
          onScanSuccess(decodedText);

          if (scannerRef.current) {
            Promise.resolve(scannerRef.current.stop())
              .catch(console.warn)
              .finally(() => onClose());
          } else {
            onClose();
          }
        },
        (errorMessage) => {
          // ignore scanning errors
        }
      )
      .catch((err) => {
        console.error('Failed to start scanner:', err);
        closeScanner();
      });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeScanner();
    };
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (scannerRef.current && !isClosing.current) {
        Promise.resolve(scannerRef.current.stop()).catch(console.warn);
        Promise.resolve(scannerRef.current.clear()).catch(console.warn);
      }
    };
  }, [onScanSuccess, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeScanner();
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    closeScanner();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-2xl p-4 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10"
          onClick={handleCancel}
        >
          <X className="w-5 h-5" />
        </Button>
        <div id="qr-reader" className="w-full overflow-hidden rounded-xl" />
        <p className="text-center text-sm text-gray-600 mt-3">
          Position the QR code inside the frame
        </p>
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={handleCancel} className="w-full">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};