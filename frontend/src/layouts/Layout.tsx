import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { Box, CssBaseline } from '@mui/material';

const Layout: React.FC = () => {
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Box
        sx={{
          marginBottom: '5vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
