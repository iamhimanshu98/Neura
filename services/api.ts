import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000'; // Android Emulator
  }
  return 'http://127.0.0.1:5000'; // iOS Simulator
};


export const API_BASE_URL = getBaseUrl();

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export async function sendMessage(message: string): Promise<ChatMessage> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return {
      id: Date.now().toString(),
      text: data.response,
      isUser: false,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

export async function getChatHistory(): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat/history`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.map((msg: any) => ({
      id: msg.id,
      text: msg.text,
      isUser: msg.is_user,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
}