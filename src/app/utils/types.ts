export interface Message {
  role: string;
  content: string;
  isTyping?: boolean;
  isError?: boolean;
  originalPrompt?: string;
}

export interface PromptConfig {
  language: string;
  context: string;
  grade: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  promptConfig?: PromptConfig;
}
