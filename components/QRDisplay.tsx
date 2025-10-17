
import React from 'react';
import Spinner from './Spinner';

interface QRDisplayProps {
  qrData: string | null;
  isLoading: boolean;
  error: string | null;
}

const QRDisplay: React.FC<QRDisplayProps> = ({ qrData, isLoading, error }) => {

  const handleDownload = () => {
    if (!qrData) return;
    const link = document.createElement('a');
    link.href = qrData;
    link.download = 'vietqr-payment.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Spinner />
          <p className="text-gray-600 font-medium">Generating your QR code...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-semibold text-red-700">Generation Failed</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      );
    }
    
    if (qrData) {
      return (
        <div className="flex flex-col items-center space-y-6">
          <h3 className="text-xl font-bold text-gray-800">Your QR Code is Ready!</h3>
          <div className="p-4 bg-white rounded-lg shadow-inner">
            <img src={qrData} alt="Generated QR Code" className="w-64 h-64 mx-auto" />
          </div>
          <button
            onClick={handleDownload}
            className="w-full max-w-xs flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
          >
            Download QR
          </button>
        </div>
      );
    }

    return (
      <div className="text-center text-gray-500">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 7l10 10M7 17L17 7" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" transform="rotate(90 12 12)" />
         </svg>
        <h3 className="mt-4 text-lg font-semibold">Your QR code will appear here</h3>
        <p className="mt-1 text-sm">Fill out the form and click "Generate" to start.</p>
      </div>
    );
  };
  
  return (
    <div className="bg-blue-50/50 p-6 sm:p-8 flex items-center justify-center min-h-[400px] lg:min-h-full">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default QRDisplay;
