import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Conversation } from '../types/conversation';
import CustomBox from '../components/CustomBox';
import Timestamp from '../components/Timestamp';
import SendMessage from '../components/SendMessage';
import useUserData from '../hooks/useUserData';

export default function ConversationPage() {
  const { participant } = useParams<{ participant: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const userData = useUserData();
  const token = localStorage.getItem('token');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesRef = useRef<string[]>([]);

  useEffect(() => {
    const fetchConversation = async () => {
      const response = await fetch(`/api/messages/${participant}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversation({ messages: data.messages });
        }
      }
      setLoading(false);
    };

    fetchConversation();
    const intervalId = setInterval(fetchConversation, 1000);
    return () => clearInterval(intervalId);
  }, [participant, token]);

  useEffect(() => {
    if (conversation) {
      const currentMessages = conversation.messages.map((msg) => msg._id);
      if (
        JSON.stringify(prevMessagesRef.current) !==
        JSON.stringify(currentMessages)
      ) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        prevMessagesRef.current = currentMessages;
      }
    }
  }, [conversation]);

  const handleNewMessage = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">Loading conversation...</Typography>
      </Box>
    );
  }

  return (
    <CustomBox sx={{ gap: 2 }}>
      <Typography variant="h4">
        Conversation with <i>{participant}</i>
      </Typography>
      <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: '45vh', padding: 1 }}>
        {conversation ? (
          <>
            {conversation.messages.map((msg) => (
              <Paper
                key={msg._id}
                sx={{
                  textAlign: 'center',
                  padding: 1,
                  marginBottom: 2,
                  backgroundColor: (theme) =>
                    userData && msg.sender === userData.username
                      ? theme.palette.primary.light
                      : theme.palette.background.paper,
                  color: (theme) =>
                    userData && msg.sender === userData.username
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
                  gutterBottom
                >
                  {userData && msg.sender === userData.username
                    ? 'You'
                    : msg.sender}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontStyle: 'italic',
                    wordWrap: 'break-word',
                    wordBreak: 'break-all',
                  }}
                >
                  {msg.message}
                </Typography>
                <Timestamp timestamp={msg.timestamp} />
              </Paper>
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <Typography variant="body1" color="textSecondary">
            No messages yet.
          </Typography>
        )}
      </Box>
      {participant && (
        <SendMessage
          receiver={participant}
          token={token}
          onMessageSent={handleNewMessage}
          showMessageFeedback={false}
        />
      )}
    </CustomBox>
  );
}
