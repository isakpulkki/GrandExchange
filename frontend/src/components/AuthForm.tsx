import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomBox from './CustomBox';
import type { AuthFormProps } from '../types/authForm';

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    confirmPassword?: string;
  }>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const regex = /^[A-Za-z0-9!"#€%&/()@]+$/;
    if (regex.test(value) || value === '') {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { username, password, confirmPassword } = formData;
    if (type === 'register') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }
    }

    const url = type === 'login' ? '/api/login' : '/api/users';
    const payload = { username, password };

    try {
      const response = await axios.post(url, payload);
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError('Too many requests, please wait.');
        } else {
          const errorMessage =
            err.response?.data?.error ||
            'An unexpected error occurred. Please try again.';
          setError(errorMessage);
        }
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
    <CustomBox>
      <Typography variant="h4" gutterBottom>
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
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        {type === 'register' && (
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            name="confirmPassword"
            value={formData.confirmPassword || ''}
            onChange={handleChange}
            error={formData.password !== formData.confirmPassword}
            helperText={
              formData.password !== formData.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
          />
        )}
        <Button
          variant="contained"
          fullWidth
          type="submit"
          sx={{ marginTop: 2 }}
          disabled={
            (type === 'register' &&
              formData.password !== formData.confirmPassword) ||
            !formData.username ||
            !formData.password
          }
        >
          {type === 'login' ? 'Log In' : 'Register'}
        </Button>
      </form>

      <Typography align="center" color="textSecondary" sx={{ mt: 2 }}>
        {type === 'login' ? (
          <>
            Don’t have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/register')}
              sx={{ cursor: 'pointer' }}
            >
              Register here
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link
              component="button"
              onClick={() => navigate('/login')}
              sx={{ cursor: 'pointer' }}
            >
              Log in here
            </Link>
          </>
        )}
      </Typography>
    </CustomBox>
  );
};

export default AuthForm;
