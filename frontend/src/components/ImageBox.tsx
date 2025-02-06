import React from 'react';
import { Box } from '@mui/material';
import type { ImageBoxProps } from '../types/imageBox';

const ImageBox: React.FC<ImageBoxProps> = ({ image, fullSize = false }) => {
  return (
    <Box
      sx={{
        width: fullSize ? '100%' : '80%',
        paddingBottom: fullSize ? '0' : '80%',
        position: 'relative',
        margin: '0 auto 12px',
        borderRadius: '8px',
        overflow: 'hidden',
        height: fullSize ? 'auto' : 0,
      }}
    >
      <Box
        component="img"
        src={`/api/uploads/${image}`}
        sx={{
          width: '100%',
          height: fullSize ? 'auto' : '100%',
          maxHeight: fullSize ? '400px' : 'none',
          objectFit: fullSize ? 'contain' : 'cover',
          position: fullSize ? 'relative' : 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </Box>
  );
};

export default ImageBox;
