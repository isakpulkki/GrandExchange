import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface CustomBoxProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}

const CustomBox: React.FC<CustomBoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx,
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CustomBox;
