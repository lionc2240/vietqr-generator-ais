import React, { useEffect } from 'react';

interface QRModalProps {
  qrDataURL: string;
  onClose: () => void;
}

const QRModal: React.FC<QRModalProps> = ({ qrDataURL, onClose }) => {
  
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrDataURL;
    link.download = 'vietqr-payment.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      aria-labelledby="qr-modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-sm w-full transform transition-all"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition" 
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <h2 id="qr-modal-title" className="text-2xl font-bold text-gray-800 mb-4">
          Scan to Pay
        </h2>
        
        <div className="p-2 bg-gray-100 rounded-lg inline-block shadow-inner">
          <img 
            src={qrDataURL} 
            alt="Generated VietQR Code" 
            className="w-64 h-64 sm:w-72 sm:h-72" 
          />
        </div>

        <p className="text-sm text-gray-500 mt-4">
          Point your camera or banking app at the code to complete the payment.
        </p>

        <button
          onClick={handleDownload}
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
        >
          Download QR
        </button>
      </div>
    </div>
  );
};

export default QRModal;
