// CustomBox.tsx
import React from 'react';
import { Box, SxProps, Theme } from '@mui/material';

interface CustomBoxProps {
  children: React.ReactNode; // This allows any valid React children (string, JSX, etc.)
  sx?: SxProps<Theme>; // This type ensures sx is compatible with MUI theme styles
}

const CustomBox: React.FC<CustomBoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: '0 auto',
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...sx, // Apply any additional styles passed through the sx prop
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CustomBox;