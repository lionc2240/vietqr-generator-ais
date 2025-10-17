
import { Profile } from '../types';

const PROFILES_STORAGE_KEY = 'vietqr_profiles';

export const getProfiles = (): Profile[] => {
  try {
    const profilesJson = localStorage.getItem(PROFILES_STORAGE_KEY);
    if (profilesJson) {
      const profiles = JSON.parse(profilesJson);
      if (Array.isArray(profiles)) {
        return profiles;
      }
    }
  } catch (error) {
    console.error("Failed to parse profiles from localStorage", error);
  }
  return [];
};

export const saveProfile = (newProfile: Profile): Profile[] => {
  const profiles = getProfiles();
  const existingProfileIndex = profiles.findIndex(
    p => p.profileName.toLowerCase() === newProfile.profileName.toLowerCase()
  );

  if (existingProfileIndex !== -1) {
    // Update existing profile
    profiles[existingProfileIndex] = newProfile;
  } else {
    // Add new profile
    profiles.push(newProfile);
  }

  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
};

export const deleteProfile = (profileName: string): Profile[] => {
  let profiles = getProfiles();
  profiles = profiles.filter(
      p => p.profileName.toLowerCase() !== profileName.toLowerCase()
  );
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
  return profiles;
};
