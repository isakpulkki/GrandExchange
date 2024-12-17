import React from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface ListingProps {
  title: string;
  description: string;
  price: number;
  id: number;
  handleDelete?: (id: number) => void;
  user?: string;
}

const Listing: React.FC<ListingProps> = ({
  title,
  description,
  price,
  id,
  handleDelete,
  user,
}) => {
  return (
    <Paper>
      <Box sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            textAlign: 'center',
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {title}
        </Typography>
        <Typography
          gutterBottom
          sx={{
            textAlign: 'center',
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {description.length > 120
            ? `${description.substring(0, 120)}...`
            : description}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ textAlign: 'center' }}>
        {price} €
      </Typography>

      {handleDelete ? (
        <IconButton onClick={() => handleDelete(id)} sx={{ marginTop: 2 }}>
          <Delete color="error" />
        </IconButton>
      ) : (
        user && (
          <Typography
            variant="body2"
            sx={{ textAlign: 'center', marginTop: 2 }}
          >
            Added by <span style={{ fontStyle: 'italic' }}>{user}</span>
          </Typography>
        )
      )}
    </Paper>
  );
};

export default Listing;
