import React from 'react';
import { Box } from '@mui/material';

interface ImageBoxProps {
  image: string;
}

const ImageBox: React.FC<ImageBoxProps> = ({ image }) => {
  return (
    <Box
      component="img"
      src={`/api/uploads/${image}`}
      sx={{
        width: 'auto',
        height: '350px',
        maxWidth: '100%',
        objectFit: 'contain',
        marginBottom: '12px',
        borderRadius: '8px',
      }}
    />
  );
};

export default ImageBox;
