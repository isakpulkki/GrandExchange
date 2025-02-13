import { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { LIMITS } from '../config/index';
import { SendMessageProps } from '../types/sendMessage';

const SendMessage: React.FC<SendMessageProps> = ({
  receiver,
  token,
  onMessageSent,
  showMessageFeedback = true,
}) => {
  const [input, setInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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
      body: JSON.stringify({ receiver, message: input }),
    });

    if (response.ok) {
      setInput('');
      setMessage('Message sent successfully!');
      onMessageSent?.(input);
    } else {
      const errorMessage = await response.text();
      setMessage(errorMessage || 'Failed to send message.');
    }
  };

  return (
    <>
      <TextField
        label="Type your message"
        fullWidth
        multiline
        rows={showMessageFeedback ? 3 : 2}
        value={input}
        onChange={(e) =>
          e.target.value.length <= LIMITS.message && setInput(e.target.value)
        }
        variant="outlined"
        helperText={`${input.length}/${LIMITS.message}`}
      />
      <Button variant="contained" color="primary" onClick={handleMessageSubmit}>
        Send Message
      </Button>

      {showMessageFeedback && message && (
        <Typography
          sx={{ marginTop: 1 }}
          color={message.toLowerCase().includes('success') ? 'green' : 'error'}
        >
          {message}
        </Typography>
      )}
    </>
  );
};

export default SendMessage;
