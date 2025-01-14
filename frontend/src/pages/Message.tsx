import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { Conversation } from '../types/conversation';
import CustomBox from '../components/CustomBox';
import Timestamp from '../components/Timestamp';

export default function ConversationPage() {
  const { participant } = useParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
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

    fetchConversation();
  }, [participant, token]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', marginTop: 4 }}>
        <Typography variant="h6">Loading conversation...</Typography>
      </Box>
    );
  }

  return (
    <CustomBox sx={{ gap: 2 }}>
      <Typography variant="h5">Conversation with {participant}</Typography>
      {conversation ? (
        <>
          {conversation.messages.map((msg) => (
            <Paper
              key={msg._id}
              sx={{
                textAlign: 'center',
                padding: 2,
                backgroundColor: (theme) =>
                  msg.sender === 'You'
                    ? theme.palette.primary.light
                    : theme.palette.background.paper,
                color: (theme) =>
                  msg.sender === 'You'
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
                {msg.sender}
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
    </CustomBox>
  );
}
