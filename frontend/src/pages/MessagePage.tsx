import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Typography, Paper, Box, TextField, Button } from '@mui/material';
import { Conversation } from '../types/conversation';
import CustomBox from '../components/CustomBox';
import Timestamp from '../components/Timestamp';

export default function ConversationPage() {
  const { participant } = useParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserName(data.username);
      }
    };

    const fetchConversation = async () => {
      const response = await fetch(`/api/messages/${participant}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setConversation({
            messages: data.messages,
          });
        }
      }
      setLoading(false);
    };

    fetchUserData();
    fetchConversation();
    const intervalId = setInterval(fetchConversation, 5000);
    return () => clearInterval(intervalId);
  }, [participant, token]);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ receiver: participant, message: newMessage }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setConversation((prevConversation) => {
          if (prevConversation) {
            return {
              ...prevConversation,
              messages: [...prevConversation.messages, {
                _id: data.conversation.messages[data.conversation.messages.length - 1]._id,
                sender: userName,
                message: newMessage,
                timestamp: new Date().toISOString(),
              }],
            };
          }
          return prevConversation;
        });
        setNewMessage('');
      }
    }
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
      <Typography variant="h4">Conversation with <i>{participant}</i></Typography>
      {conversation ? (
        <>
          {conversation.messages.map((msg) => (
            <Paper
              key={msg._id}
              sx={{
                textAlign: 'center',
                padding: 2,
                backgroundColor: (theme) =>
                  msg.sender === userName
                    ? theme.palette.primary.light
                    : theme.palette.background.paper,
                color: (theme) =>
                  msg.sender === userName
                    ? theme.palette.primary.contrastText
                    : theme.palette.text.primary,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-all',
                }}
                gutterBottom
              >
                {msg.sender === userName ? 'You' : msg.sender}
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
        </>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No messages yet.
        </Typography>
      )}
      <Box component="form" onSubmit={handleSendMessage} sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </CustomBox>
  );
}