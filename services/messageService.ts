
import { SavedMessage } from '../types';

const MESSAGES_STORAGE_KEY = 'vietqr_messages';

export const getMessages = (): SavedMessage[] => {
  try {
    const messagesJson = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (messagesJson) {
      const messages = JSON.parse(messagesJson);
      if (Array.isArray(messages)) {
        return messages;
      }
    }
  } catch (error) {
    console.error("Failed to parse messages from localStorage", error);
  }
  return [];
};

export const saveMessage = (newMessage: SavedMessage): SavedMessage[] => {
  const messages = getMessages();
  const existingMessageIndex = messages.findIndex(
    m => m.name.toLowerCase() === newMessage.name.toLowerCase()
  );

  if (existingMessageIndex !== -1) {
    // Update existing message
    messages[existingMessageIndex] = newMessage;
  } else {
    // Add new message
    messages.push(newMessage);
  }

  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  return messages;
};

export const deleteMessage = (messageName: string): SavedMessage[] => {
  let messages = getMessages();
  messages = messages.filter(
      m => m.name.toLowerCase() !== messageName.toLowerCase()
  );
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  return messages;
};
