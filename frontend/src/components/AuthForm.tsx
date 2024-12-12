import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface AuthFormProps {
  type: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { username, password } = formData;
    const url = type === 'login' ? '/api/login' : '/api/users';
    const payload = { username, password };

    try {
      const response = await axios.post(url, payload);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMessage =
          err.response?.data?.error ||
          'An unexpected error occurred. Please try again.';
        setError(errorMessage);
      } else if (err instanceof Error) {
        setError(
          err.message || 'An unexpected error occurred. Please try again.'
        );
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        {type === 'login' ? 'Log In' : 'Register'}
      </Typography>

      {error && (
        <Typography color="error" variant="body2" gutterBottom>
          {error}
        </Typography>
      )}

      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
        >
          {type === 'login' ? 'Log In' : 'Register'}
        </Button>
      </form>
    </Box>
  );
};

export default AuthForm;
