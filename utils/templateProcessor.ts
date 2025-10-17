/**
 * Synchronously processes a message template string, replacing placeholders with dynamic values.
 * @param template The string containing placeholders like {date}, {time}, and {location}.
 * @param locationName The pre-fetched location name, or null if not available.
 * @returns The processed string with placeholders replaced.
 */
export const processMessageTemplate = (template: string, locationName: string | null): string => {
  let processedText = template;

  // Replace {date} with current date in ddmmyy format
  if (processedText.includes('{date}')) {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear().toString().slice(-2);
    const date = `${day}${month}${year}`;
    processedText = processedText.replace(/{date}/g, date);
  }

  // Replace {time} with current time in "xxhxx" format (e.g., 21h30)
  if (processedText.includes('{time}')) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const time = `${hours}h${minutes}`;
    processedText = processedText.replace(/{time}/g, time);
  }

  // Replace {location} with the pre-fetched location name
  if (processedText.includes('{location}')) {
      // Use the provided locationName, or an empty string if it's null/unavailable
      processedText = processedText.replace(/{location}/g, locationName || '');
  }

  // Clean up any double spaces that might result from an empty placeholder
  return processedText.replace(/\s\s+/g, ' ').trim();
};