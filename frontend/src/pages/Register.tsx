import React from 'react';
import { Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function Register() {
  const navigate = useNavigate();

  return (
    <>
      <AuthForm type="register" />
      <Typography align="center" sx={{ mt: 2 }}>
        Already have an account?{' '}
        <Link
          component="button"
          onClick={() => navigate('/login')}
          sx={{ cursor: 'pointer' }}
        >
          Log in here
        </Link>
      </Typography>
    </>
  );
}
