import { useEffect, useState } from 'react';
import { Typography, Paper, CircularProgress, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomBox from '../components/CustomBox';
import Timestamp from '../components/Timestamp';
import { ConversationSummary } from '../types/summary';

export default function Messages() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      const response = await fetch('/api/messages', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      }

      setLoading(false);
    };

    fetchConversations();
  }, []);

  const handleConversationClick = (participant: string) => {
    navigate(`/messages/${participant}`);
  };

  const truncateMessage = (message: string): string => {
    return message.length > 50 ? `${message.substring(0, 50)}...` : message;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CustomBox sx={{ gap: 2 }}>
      <Typography variant="h4">Messages</Typography>
      {conversations.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          You don't have any conversations yet.
        </Typography>
      ) : (
        conversations.map((conversation) => (
          <Paper
            key={conversation.lastMessage.timestamp}
            onClick={() =>
              handleConversationClick(conversation.otherParticipant)
            }
            sx={{
              textAlign: 'center',
              padding: 2,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            <Typography variant="body1" gutterBottom>
              {conversation.otherParticipant}
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              {truncateMessage(conversation.lastMessage.message)}
            </Typography>
            <Timestamp timestamp={conversation.lastMessage.timestamp} />
          </Paper>
        ))
      )}
    </CustomBox>
  );
}
