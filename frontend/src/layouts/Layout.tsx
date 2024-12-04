import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { Box, Container, CssBaseline } from '@mui/material';

const Layout: React.FC = () => {
  return (
    <Box>
      <CssBaseline />
      <NavigationBar />
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
