// src/types/chat.ts
export interface ChatMessage {
  id: string | number;
  user: string;
  text: string;
  color: string;
  timestamp?: number;
}
