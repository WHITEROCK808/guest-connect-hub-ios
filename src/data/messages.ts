
import { v4 as uuidv4 } from 'uuid';

export type MessageStatus = 'unread' | 'inprogress' | 'completed';

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  assignedTo?: string;
  imageUrl?: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  content: string;
  timestamp: Date;
  staffName: string;
}

// Initialize with some sample messages
export const initialMessages: Message[] = [
  {
    id: uuidv4(),
    content: "The air conditioning in my room isn't working properly. Can someone come take a look?",
    timestamp: new Date(Date.now() - 3600000 * 5), // 5 hours ago
    status: 'unread',
    replies: []
  },
  {
    id: uuidv4(),
    content: "I'd like to request extra towels for room 302, please.",
    timestamp: new Date(Date.now() - 3600000 * 8), // 8 hours ago
    status: 'inprogress',
    assignedTo: 'Team A',
    replies: [
      {
        id: uuidv4(),
        content: "We'll bring extra towels to your room right away. Thank you for your patience!",
        timestamp: new Date(Date.now() - 3600000 * 7.5), // 7.5 hours ago
        staffName: 'Team A'
      }
    ]
  },
  {
    id: uuidv4(),
    content: "What time does the breakfast buffet open tomorrow morning?",
    timestamp: new Date(Date.now() - 3600000 * 10), // 10 hours ago
    status: 'completed',
    assignedTo: 'Team B',
    replies: [
      {
        id: uuidv4(),
        content: "The breakfast buffet opens at 7:00 AM and closes at 10:00 AM. We look forward to serving you!",
        timestamp: new Date(Date.now() - 3600000 * 9.8), // 9.8 hours ago
        staffName: 'Team B'
      }
    ]
  }
];

// For our frontend-only demo, we'll store messages in localStorage
export const getMessages = (): Message[] => {
  try {
    const stored = localStorage.getItem('messages');
    if (stored) {
      // Convert string dates back to Date objects
      const parsedMessages = JSON.parse(stored);
      return parsedMessages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
        replies: message.replies.map((reply: any) => ({
          ...reply,
          timestamp: new Date(reply.timestamp)
        }))
      }));
    }
    // Initialize with sample data if nothing is stored
    localStorage.setItem('messages', JSON.stringify(initialMessages));
    return initialMessages;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    return [];
  }
};

export const saveMessages = (messages: Message[]) => {
  try {
    localStorage.setItem('messages', JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages:', error);
  }
};

export const addMessage = (content: string, imageUrl?: string) => {
  const messages = getMessages();
  const newMessage: Message = {
    id: uuidv4(),
    content,
    timestamp: new Date(),
    status: 'unread',
    imageUrl,
    replies: []
  };
  
  const updatedMessages = [newMessage, ...messages];
  saveMessages(updatedMessages);
  return newMessage;
};

export const addReply = (messageId: string, content: string, staffName: string) => {
  const messages = getMessages();
  const messageIndex = messages.findIndex(m => m.id === messageId);
  
  if (messageIndex >= 0) {
    const newReply: Reply = {
      id: uuidv4(),
      content,
      timestamp: new Date(),
      staffName
    };
    
    messages[messageIndex].replies = [...messages[messageIndex].replies, newReply];
    saveMessages(messages);
    return newReply;
  }
  return null;
};

export const updateMessageStatus = (messageId: string, status: MessageStatus, assignedTo?: string) => {
  const messages = getMessages();
  const messageIndex = messages.findIndex(m => m.id === messageId);
  
  if (messageIndex >= 0) {
    messages[messageIndex].status = status;
    if (assignedTo) {
      messages[messageIndex].assignedTo = assignedTo;
    }
    saveMessages(messages);
    return messages[messageIndex];
  }
  return null;
};
