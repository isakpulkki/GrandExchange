import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MenuIcon from '@mui/icons-material/Menu';

function NavigationBar() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = (path: string) => {
    setAnchorElNav(null);
    navigate(path);
  };
  const navItems = [
    { label: 'New Listing', path: '/newlisting' },
    { label: 'Messages', path: '/messages' },
    { label: 'Log In', path: '/login' },
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            onClick={() => navigate('/')}
            sx={{
              flexGrow: 1,
              mr: 2,
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <StorefrontIcon sx={{ mr: 0.8, mt: 0.4, cursor: 'pointer' }} />
            GrandExchange
          </Typography>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              justifyContent: 'flex-end',
            }}
          >
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={() => setAnchorElNav(null)}
            >
              {navItems.map((item) => (
                <MenuItem
                  key={item.label}
                  onClick={() => handleCloseNavMenu(item.path)}
                >
                  <Typography textAlign="center">{item.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'flex-end',
            }}
          >
            {navItems.map((item) => (
              <Button
                key={item.label}
                onClick={() => handleCloseNavMenu(item.path)}
                sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                    color: 'inherit',
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default NavigationBar;
