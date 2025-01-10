import React from 'react';
import { Paper, Box, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface ListingProps {
  title: string;
  description: string;
  price: number;
  image: string;
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
  image,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listings/${id}`);
  };

  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (handleDelete) {
      handleDelete(id);
    }
  };

  return (
    <Paper
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.primary.light,
        },
        padding: '16px',
        height: '100%',
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {title}
        </Typography>

        <Box
          component="img"
          src={`/api/uploads/${image}`}
          sx={{
            width: 'auto',
            height: '300px',
            maxWidth: '100%',
            objectFit: 'contain',
            marginBottom: '16px',
            borderRadius: '8px',
          }}
        />
        <Typography
          gutterBottom
          sx={{
            wordWrap: 'break-word',
            wordBreak: 'break-all',
          }}
        >
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Typography>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
          {price} €
        </Typography>

        {handleDelete ? (
          <IconButton onClick={handleDeleteClick} sx={{ marginTop: 2 }}>
            <Delete color="error" />
          </IconButton>
        ) : (
          user && (
            <Typography variant="body2">
              Added by <span style={{ fontStyle: 'italic' }}>{user}</span>
            </Typography>
          )
        )}
      </Box>
    </Paper>
  );
};

export default Listing;
