import React, { useState, useEffect, useCallback } from 'react';
// FIX: Corrected imports. The type definitions are now correctly exported from types.ts
import { Bank, VietQRRequest, VietQRResponse, Profile, SavedMessage } from './types';
import { fetchBanks, generateQR } from './services/vietqrService';
import { getProfiles, saveProfile, deleteProfile } from './services/profileService';
// FIX: Corrected imports. The message service functions are now correctly exported from messageService.ts
import { getMessages, saveMessage, deleteMessage } from './services/messageService';
import { processMessageTemplate } from './utils/templateProcessor';
import { generateSmartMessage } from './utils/smartMessageGenerator';
import { getLocationName } from './services/locationService';
import Header from './components/Header';
import QRForm from './components/QRForm';
import QRDisplay from './components/QRDisplay';
import QRModal from './components/QRModal';

/**
 * Generates a new unique profile name if the base name already exists.
 * e.g., if "My Bank" exists, it will suggest "My Bank (1)".
 * @param baseName The desired profile name.
 * @param existingProfiles The array of current profiles.
 * @returns A unique profile name string.
 */
const getNewProfileName = (baseName: string, existingProfiles: Profile[]): string => {
    const trimmedBaseName = baseName.trim();
    const existingNames = existingProfiles.map(p => p.profileName.toLowerCase());
    
    if (!existingNames.includes(trimmedBaseName.toLowerCase())) {
        return trimmedBaseName;
    }

    let counter = 1;
    let newName = `${trimmedBaseName} (${counter})`;
    while (existingNames.includes(newName.toLowerCase())) {
        counter++;
        newName = `${trimmedBaseName} (${counter})`;
    }
    return newName;
};


function App() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [formData, setFormData] = useState<Partial<VietQRRequest>>({
    acqId: 0,
    accountNo: '',
    accountName: '',
    amount: undefined,
    addInfo: '',
    template: 'compact',
  });
  const [qrData, setQrData] = useState<VietQRResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  
  // Profile state
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileName, setSelectedProfileName] = useState<string>('');
  
  // Message state
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [selectedMessageName, setSelectedMessageName] = useState<string>('');

  // Location state
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  // UI State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    setProfiles(getProfiles());
    setMessages(getMessages());

    const getBanks = async () => {
      try {
        const bankData = await fetchBanks();
        setBanks(bankData);
        if (bankData.length > 0) {
          setFormData(prev => ({ ...prev, acqId: bankData[0].bin }));
        }
      } catch (err) {
        setError('Failed to load the list of banks. Please refresh the page.');
      }
    };

    getBanks();
  }, []);
  
  // Effect for fetching location ONCE on component mount
  useEffect(() => {
    const fetchLocation = async () => {
        setLocationStatus('Detecting location...');
        try {
            const locationName = await getLocationName();
            setCurrentLocation(locationName);
            setLocationStatus(`Location: ${locationName}`);
        } catch (err) {
            setCurrentLocation(null);
            if (err instanceof Error) {
                setLocationStatus(`Error: ${err.message}`);
            } else {
                setLocationStatus('Could not get location. Please enable permissions.');
            }
        }
    };
    fetchLocation();
  }, []);

  // Effect for handling placeholder replacement when location is ready
  useEffect(() => {
    // Only run replacement if the modal is closed and we have a location.
    if (!isDropdownOpen && currentLocation && formData.addInfo?.includes('{location}')) {
        setFormData(prev => ({
            ...prev,
            addInfo: prev.addInfo.replace(/{location}/g, currentLocation)
        }));
    }
  }, [currentLocation, formData.addInfo, isDropdownOpen]);

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    let processedValue: string | number | undefined;
    if (name === 'accountName') {
        processedValue = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    } else if (name === 'amount' || name === 'acqId') {
        processedValue = value ? parseInt(value, 10) : undefined;
    } else {
        processedValue = value;
    }

    // Auto-deselect profile if its core fields are manually changed
    if (selectedProfileName && ['acqId', 'accountNo', 'accountName'].includes(name)) {
        const currentProfile = profiles.find(p => p.profileName === selectedProfileName);
        if (currentProfile) {
            const wouldBeFormData = { ...formData, [name]: processedValue };
            if (
                wouldBeFormData.acqId !== currentProfile.acqId ||
                wouldBeFormData.accountNo !== currentProfile.accountNo ||
                wouldBeFormData.accountName !== currentProfile.accountName
            ) {
                setSelectedProfileName('');
            }
        }
    }

    // Auto-deselect message if its text is manually changed
    if (name === 'addInfo' && selectedMessageName) {
        const currentMessage = messages.find(m => m.name === selectedMessageName);
        // Compare against the raw template, as the input now holds the unprocessed template
        if (currentMessage && value !== currentMessage.template) {
            setSelectedMessageName('');
        }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  }, [formData, profiles, selectedProfileName, messages, selectedMessageName]);
  
  const handleSaveProfile = useCallback((profileName: string) => {
    const trimmedProfileName = profileName.trim();
    if (!trimmedProfileName || !formData.acqId || !formData.accountNo || !formData.accountName) {
        setError("Cannot save profile with missing bank, account number, or account name.");
        return;
    }

    const existingProfile = profiles.find(p => p.profileName.toLowerCase() === trimmedProfileName.toLowerCase());

    const performSave = (nameToSave: string) => {
        const profileToSave: Profile = {
            profileName: nameToSave,
            acqId: formData.acqId!,
            accountNo: formData.accountNo!,
            accountName: formData.accountName!,
        };
        const updatedProfiles = saveProfile(profileToSave);
        setProfiles(updatedProfiles);
        setSelectedProfileName(nameToSave);
        setError(null);
    };

    if (existingProfile) {
        if (window.confirm(`A profile named "${trimmedProfileName}" already exists. Do you want to update it?`)) {
            performSave(trimmedProfileName);
        } else {
            const newSuggestedName = getNewProfileName(trimmedProfileName, profiles);
            if (window.confirm(`Would you like to save this as a new profile named "${newSuggestedName}" instead?`)) {
                performSave(newSuggestedName);
            }
        }
    } else {
        performSave(trimmedProfileName);
    }
  }, [formData, profiles]);

  const handleSelectProfile = useCallback((profileName: string) => {
    setSelectedProfileName(profileName);
    const selectedProfile = profiles.find(p => p.profileName === profileName);
    if (selectedProfile) {
        setFormData(prev => ({
            ...prev,
            acqId: selectedProfile.acqId,
            accountNo: selectedProfile.accountNo,
            accountName: selectedProfile.accountName,
        }));
        setQrData(null);
        setError(null);
    }
  }, [profiles]);

  const handleDeleteProfile = useCallback((profileName: string) => {
      const updatedProfiles = deleteProfile(profileName);
      setProfiles(updatedProfiles);
      if (selectedProfileName === profileName) {
          setSelectedProfileName('');
      }
  }, [selectedProfileName]);

  const handleSaveMessage = useCallback((message: SavedMessage) => {
    const updatedMessages = saveMessage(message);
    setMessages(updatedMessages);
  }, []);
  
  const handleSelectMessage = useCallback((name: string) => {
    setSelectedMessageName(name);
    if (name) {
        const message = messages.find(m => m.name === name);
        if (message) {
            // Process the template immediately upon selection and set the result.
            const processedMessage = processMessageTemplate(message.template, currentLocation);
            setFormData(prev => ({...prev, addInfo: processedMessage}));
        }
    } else {
        setFormData(prev => ({...prev, addInfo: ''}));
    }
  }, [messages, currentLocation]);

  const handleDeleteMessage = useCallback((name: string) => {
    const updatedMessages = deleteMessage(name);
    setMessages(updatedMessages);
    
    if(selectedMessageName === name) {
        setSelectedMessageName('');
        setFormData(prev => ({...prev, addInfo: ''}));
    }
  }, [selectedMessageName]);

  const handleClearForm = useCallback(() => {
    setFormData(prev => ({
        ...prev,
        amount: undefined,
        addInfo: '',
    }));
    setQrData(null);
    setError(null);
    setSelectedMessageName('');
    setIsQrModalOpen(false);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setQrData(null);
    setIsLoading(true);

    if (!formData.acqId || !formData.accountNo || !formData.accountName) {
        setError("Please fill in all required fields: Bank, Account Number, and Account Name.");
        setIsLoading(false);
        return;
    }
    
    const rawMessage = formData.addInfo?.trim();
    let processedMessage: string;

    if (rawMessage) {
        // The message may already have location replaced, but process for date/time.
        processedMessage = processMessageTemplate(rawMessage, currentLocation);
    } else {
        processedMessage = generateSmartMessage();
    }

    const payload: VietQRRequest = {
        acqId: formData.acqId,
        accountNo: formData.accountNo,
        accountName: formData.accountName,
        amount: formData.amount,
        addInfo: processedMessage, // Use the fully processed message
        template: 'compact',
        format: 'image'
    };

    try {
      const result = await generateQR(payload);
      if(result.success) {
        setQrData(result);
        setIsQrModalOpen(true);
      } else {
        setError(result.desc || 'An unknown error occurred.');
      }
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unexpected error occurred while generating the QR code.');
        }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        <main className="mt-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <QRForm
              banks={banks}
              formData={formData}
              isLoading={isLoading}
              onFormChange={handleFormChange}
              onFormSubmit={handleFormSubmit}
              onClearForm={handleClearForm}
              profiles={profiles}
              selectedProfileName={selectedProfileName}
              onSaveProfile={handleSaveProfile}
              onSelectProfile={handleSelectProfile}
              onDeleteProfile={handleDeleteProfile}
              messages={messages}
              selectedMessageName={selectedMessageName}
              onSaveMessage={handleSaveMessage}
              onSelectMessage={handleSelectMessage}
              onDeleteMessage={handleDeleteMessage}
              locationStatus={locationStatus}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
            />
            <QRDisplay 
              qrData={qrData?.data?.qrDataURL || null}
              isLoading={isLoading}
              error={error}
            />
          </div>
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} VietQR Code Generator. Made with React & Tailwind CSS.</p>
        </footer>
      </div>
       {isQrModalOpen && qrData?.data?.qrDataURL && (
         <QRModal
           qrDataURL={qrData.data.qrDataURL}
           onClose={() => setIsQrModalOpen(false)}
         />
       )}
    </div>
  );
}

export default App;