
import React, { useState, useEffect } from 'react';
import { Bank, VietQRRequest, SavedMessage } from '../types';

interface QuickActionsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  banks: Bank[];
  formData: Partial<VietQRRequest>;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSaveProfile: (profileName: string) => void;
  onSaveMessage: (message: SavedMessage) => void;
}

const QuickActionsDropdown: React.FC<QuickActionsDropdownProps> = ({
  isOpen,
  onClose,
  banks,
  formData,
  onFormChange,
  onSaveProfile,
  onSaveMessage
}) => {
  const [profileName, setProfileName] = useState('');
  const [messageName, setMessageName] = useState('');

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

  if (!isOpen) return null;

  const handleSaveProfileClick = () => {
    if (profileName.trim()) {
      onSaveProfile(profileName.trim());
      setProfileName('');
    }
  };
  
  const handleSaveMessageClick = () => {
      const trimmedName = messageName.trim();
      const template = formData.addInfo?.trim() ?? '';
      if (trimmedName && template) {
          onSaveMessage({ name: trimmedName, template });
          setMessageName('');
          alert(`Message "${trimmedName}" saved!`);
      }
  };
  
  const canSaveProfile = !!(formData.acqId && formData.accountNo && formData.accountName && profileName.trim() !== '');
  const canSaveMessage = !!(messageName.trim() && formData.addInfo?.trim());

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} aria-hidden="true"></div>
      <div className="absolute top-0 right-0 left-0 bg-white rounded-lg shadow-2xl border z-50 p-6 max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800" aria-label="Close panel">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <div className="space-y-8">
          {/* Section 1: Bank Info & Save Profile */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Bank Info & Save Profile</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="acqId-modal" className="block text-sm font-medium text-gray-700 mb-1">Bank</label>
                <select id="acqId-modal" name="acqId" value={formData.acqId || ''} onChange={onFormChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                  {banks.map((bank) => <option key={bank.bin} value={bank.bin}>{bank.shortName} ({bank.name})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="accountNo-modal" className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" id="accountNo-modal" name="accountNo" value={formData.accountNo} onChange={onFormChange} required placeholder="e.g., 123456789" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"/>
              </div>
              <div>
                <label htmlFor="accountName-modal" className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                <input type="text" id="accountName-modal" name="accountName" value={formData.accountName} onChange={onFormChange} required placeholder="e.g., NGUYEN VAN A" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition uppercase"/>
              </div>
              <div className="pt-4 border-t">
                 <label htmlFor="profileName-modal" className="block text-sm font-medium text-gray-700 mb-1">Save Current Details as Profile</label>
                 <div className="flex items-center space-x-2">
                    <input type="text" id="profileName-modal" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Enter profile name" className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"/>
                    <button type="button" onClick={handleSaveProfileClick} disabled={!canSaveProfile} className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 transition">Save</button>
                 </div>
              </div>
            </div>
          </section>

          {/* Section 2: Save Message Template */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Save Message Template</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="addInfo-modal" className="block text-sm font-medium text-gray-700 mb-1">Message Template</label>
                    <input type="text" id="addInfo-modal" name="addInfo" value={formData.addInfo || ''} onChange={onFormChange} placeholder="Type a message template..." className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition text-sm"/>
                </div>
                <div>
                    <label htmlFor="messageName-modal" className="block text-sm font-medium text-gray-700 mb-1">Save Template As...</label>
                    <div className="flex items-center space-x-2">
                        <input type="text" id="messageName-modal" value={messageName} onChange={(e) => setMessageName(e.target.value)} placeholder="Enter message name" className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition"/>
                        <button type="button" onClick={handleSaveMessageClick} disabled={!canSaveMessage} className="py-2 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300 transition">Save</button>
                    </div>
                </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default QuickActionsDropdown;
