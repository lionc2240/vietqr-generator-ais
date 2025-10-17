
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
        VietQR Code Generator
      </h1>
      <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
        Instantly create QR codes for Vietnamese bank transfers. Fast, simple, and secure.
      </p>
    </header>
  );
};

export default Header;
