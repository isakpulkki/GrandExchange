import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { Box, CssBaseline } from '@mui/material';

const Layout: React.FC = () => {
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
        <Outlet />
    </Box>
  );
};

export default Layout;
