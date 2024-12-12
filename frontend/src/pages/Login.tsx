import React from 'react';
import { Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const navigate = useNavigate();

  return (
    <>
      <AuthForm type="login" />
      <Typography align="center" sx={{ mt: 2 }}>
        Don’t have an account?{' '}
        <Link
          component="button"
          onClick={() => navigate('/register')}
          sx={{ cursor: 'pointer' }}
        >
          Register here
        </Link>
      </Typography>
    </>
  );
}