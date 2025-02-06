import React from 'react';
import { Box } from '@mui/material';
import type { CustomBoxProps } from '../types/customBox';

const CustomBox: React.FC<CustomBoxProps> = ({ children, sx, ...props }) => {
  return (
    <Box
      sx={{
        maxWidth: 800,
        margin: '0 auto',
        padding: 1,
        display: 'flex',
        flexDirection: 'column',
        ...sx,
        textAlign: 'center',
        marginTop: 1,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default CustomBox;
