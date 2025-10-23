interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
}

const getCurrentPosition = (): Promise<GeolocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported by your browser.'));
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const reverseGeocode = async (coords: GeolocationCoordinates): Promise<string> => {
  const { latitude, longitude } = coords;
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'vi', // Prefer Vietnamese names
      },
    });
    if (!response.ok) {
      throw new Error('Reverse geocoding request failed.');
    }
    const data = await response.json();
    
    // Build a more specific location string, following user's requested format.
    const address = data.address;
    const parts = [];
    if (address.road) parts.push(address.road);
    if (address.suburb) parts.push(address.suburb);
    
    // Add the city/state part, preferring state for conciseness (e.g., "Hà Nội" over "Thành phố Hà Nội").
    const state = address.state;
    const city = address.city;
    const district = address.city_district;

    if (state) {
        parts.push(state);
    } else if (city) {
        parts.push(city);
    } else if (district) {
        parts.push(district);
    }
    
    // Filter out any empty parts and remove duplicates.
    const finalParts = [...new Set(parts.filter(Boolean))];

    if (finalParts.length > 0) {
        return finalParts.join(', ');
    }
    
    return data.display_name || 'Unknown Location';

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw error;
  }
};

/**
 * Gets the user's current location and returns a human-readable name.
 * @returns A promise that resolves to the location name string, or rejects on error.
 */
export const getLocationName = async (): Promise<string> => {
  try {
    const coords = await getCurrentPosition();
    const locationName = await reverseGeocode(coords);
    return locationName;
  } catch (error) {
    let errorMessage = 'Could not retrieve location. ';
    if (error instanceof GeolocationPositionError) {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage += 'Permission denied.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage += 'Position unavailable.';
                break;
            case error.TIMEOUT:
                errorMessage += 'Request timed out.';
                break;
            default:
                errorMessage += 'An unknown error occurred.';
                break;
        }
    } else if (error instanceof Error) {
        errorMessage += error.message;
    }
    throw new Error(errorMessage);
  }
};
