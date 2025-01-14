import { useState } from 'react';
import { Button, TextField, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LIMITS } from '../config/index';

interface SendMessageProps {
  listingUser: string;
  token: string | null;
}

const SendMessage = ({ listingUser, token }: SendMessageProps) => {
  const [input, setInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setMessage('You must be logged in to send a message!');
      return;
    }

    if (input.trim() === '') {
      setMessage('Message cannot be empty.');
      return;
    }

    setMessage('');

    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: listingUser,
        message: input,
      }),
    });

    if (response.ok) {
      setInput('');
      setMessage('Message sent successfully!');
    } else {
      const errorMessage = await response.text();
      setMessage(errorMessage || 'Failed to send message.');
    }
  };

  return (
    <>
      {!token ? (
        <Typography color="textSecondary" sx={{ marginTop: 2 }}>
          To send a message, you must be logged in.{' '}
          <Link
            component="button"
            onClick={() => navigate('/login')}
            sx={{ cursor: 'pointer' }}
          >
            Log in here
          </Link>{' '}
          or{' '}
          <Link
            component="button"
            onClick={() => navigate('/register')}
            sx={{ cursor: 'pointer' }}
          >
            register here
          </Link>
          .
        </Typography>
      ) : (
        <>
          <TextField
            label="Type your message"
            fullWidth
            multiline
            rows={6}
            value={input}
            onChange={(e) => {
              if (e.target.value.length <= LIMITS.message)
                setInput(e.target.value);
            }}
            variant="outlined"
            sx={{ marginTop: 2 }}
            helperText={`${input.length}/${LIMITS.message}`}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleMessageSubmit}
            sx={{ marginTop: 2 }}
          >
            Send Message
          </Button>
        </>
      )}

      {message && (
        <Typography
          sx={{ marginTop: 2 }}
          color={message.toLowerCase().includes('success') ? 'green' : 'error'}
        >
          {message}
        </Typography>
      )}
    </>
  );
};

export default SendMessage;
