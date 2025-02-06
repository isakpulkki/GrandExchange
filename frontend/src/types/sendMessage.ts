export interface SendMessageProps {
  receiver: string;
  token: string | null;
  onMessageSent?: (message: string) => void;
  showMessageFeedback?: boolean;
}