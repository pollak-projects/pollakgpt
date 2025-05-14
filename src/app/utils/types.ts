export interface Message {
  role: string;
  content: string;
  isTyping?: boolean;
  isError?: boolean;
  originalPrompt?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
