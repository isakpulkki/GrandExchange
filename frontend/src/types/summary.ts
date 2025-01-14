export interface ConversationSummary {
    otherParticipant: string;
    lastMessage: {
      sender: string;
      message: string;
      timestamp: string;
    };
  }