export interface Conversation {
  messages: {
    sender: string;
    message: string;
    timestamp: string;
    _id: string;
  }[];
}