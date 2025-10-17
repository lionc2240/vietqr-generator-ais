import React from 'react';
import { Bank, VietQRRequest, Profile, SavedMessage } from '../types';
import QuickActionsDropdown from './QuickActionsDropdown';

interface QRFormProps {
  banks: Bank[];
  formData: Partial<VietQRRequest>;
  isLoading: boolean;
  onFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFormSubmit: (e: React.FormEvent) => void;
  onClearForm: () => void;
  // Profile props
  profiles: Profile[];
  selectedProfileName: string;
  onSaveProfile: (profileName: string) => void;
  onSelectProfile: (profileName: string) => void;
  onDeleteProfile: (profileName: string) => void;
  // Message props
  messages: SavedMessage[];
  selectedMessageName: string;
  onSaveMessage: (message: SavedMessage) => void;
  onSelectMessage: (name: string) => void;
  onDeleteMessage: (name: string) => void;
  // Location prop
  locationStatus: string | null;
  // UI State props
  isDropdownOpen: boolean;
  setIsDropdownOpen: (isOpen: boolean) => void;
}

const QRForm: React.FC<QRFormProps> = (props) => {
  const { 
    banks, 
    formData, 
    isLoading, 
    onFormChange, 
    onFormSubmit,
    onClearForm,
    profiles,
    selectedProfileName,
    onSelectProfile,
    onDeleteProfile,
    messages,
    selectedMessageName,
    onSelectMessage,
    onDeleteMessage,
    locationStatus,
    isDropdownOpen,
    setIsDropdownOpen,
  } = props;
  
  const selectedBank = formData.acqId ? banks.find(b => b.bin === formData.acqId) : null;
  const selectedBankName = selectedBank?.shortName ?? 'Not Set';
  const fullBankName = selectedBank?.name ?? 'Bank not selected';
  
  const renderLocationStatus = () => {
      if (!locationStatus) {
        return <p className="mt-2 h-5"></p>; // Keep space for layout consistency
      }
      const isError = locationStatus.toLowerCase().startsWith('error:');
      const isSuccess = locationStatus.toLowerCase().startsWith('location:');
      let textColor = 'text-gray-700';
      if (isError) textColor = 'text-red-700';
      if (isSuccess) textColor = 'text-green-700';
      
      return <p className={`mt-2 text-xs font-medium ${textColor}`}>{locationStatus}</p>;
  };

  return (
    <div className="p-6 sm:p-8 relative">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">Enter Transfer Details</h2>
      
      {/* --- BANK INFO & MANAGE BUTTON --- */}
      <div className="mb-6 p-4 border border-blue-200 bg-blue-50/50 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
                <h3 className="text-xs font-semibold text-blue-800/80 uppercase tracking-wider">Bank</h3>
                <p className="text-base font-semibold text-gray-800 truncate" title={fullBankName}>
                    {selectedBankName}
                </p>
            </div>
            <div className="sm:col-span-2">
                <h3 className="text-xs font-semibold text-blue-800/80 uppercase tracking-wider">Account</h3>
                <p className="text-base font-semibold text-gray-800 truncate" title={`${formData.accountNo || ''} - ${formData.accountName || ''}`}>
                    {(formData.accountNo && formData.accountName) ? `${formData.accountNo} - ${formData.accountName}` : 'Not Set'}
                </p>
            </div>
        </div>
        <button
            type="button"
            onClick={() => setIsDropdownOpen(true)}
            className="mt-4 w-full text-sm py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
        >
            Manage Bank Info & Saved Items
        </button>
      </div>

      {/* --- QUICK LOAD PROFILE --- */}
      {profiles.length > 0 && (
        <div className="mb-5">
          <label htmlFor="quick-load-profile" className="block text-sm font-medium text-gray-700 mb-1">
            Quick Load Profile
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="quick-load-profile"
              name="quick-load-profile"
              value={selectedProfileName}
              onChange={(e) => onSelectProfile(e.target.value)}
              className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="">-- Select a Profile --</option>
              {profiles.map((p) => (
                <option key={p.profileName} value={p.profileName}>
                  {p.profileName}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => onDeleteProfile(selectedProfileName)}
              disabled={!selectedProfileName}
              className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              aria-label="Delete selected profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
            </button>
          </div>
        </div>
      )}

      <QuickActionsDropdown 
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        {...props}
      />

      <form onSubmit={onFormSubmit} className="space-y-5">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (VND)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount || ''}
            onChange={onFormChange}
            placeholder="e.g., 50000"
            min="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* --- QUICK LOAD MESSAGE --- */}
        {messages.length > 0 && (
            <div className="mb-5">
                <label htmlFor="quick-load-message" className="block text-sm font-medium text-gray-700 mb-1">
                    Quick Load Message
                </label>
                <div className="flex items-center space-x-2">
                    <select
                        id="quick-load-message"
                        name="quick-load-message"
                        value={selectedMessageName}
                        onChange={(e) => onSelectMessage(e.target.value)}
                        className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                    >
                        <option value="">-- Select a Message --</option>
                        {messages.map((m) => (
                            <option key={m.name} value={m.name}>
                                {m.name}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={() => onDeleteMessage(selectedMessageName)}
                        disabled={!selectedMessageName}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        aria-label="Delete selected message"
                    >
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                    </button>
                </div>
            </div>
        )}

        <div>
            <label htmlFor="addInfo" className="block text-sm font-medium text-gray-700 mb-1">
              Message / Template
            </label>
            <input
              type="text"
              id="addInfo"
              name="addInfo"
              value={formData.addInfo || ''}
              onChange={onFormChange}
              placeholder="e.g., Payment for order #123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
            {renderLocationStatus()}
        </div>
        <div className="flex items-center space-x-4">
            <button
                type="button"
                onClick={onClearForm}
                className="w-1/3 flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
            >
                Clear
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Generating...' : 'Generate QR Code'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default QRForm;