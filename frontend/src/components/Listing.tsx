import React from 'react';
import { Paper, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import CustomBox from './CustomBox';
import ImageBox from './ImageBox';

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
        flexGrow: 1,
        cursor: 'pointer',
        height: '100%',
        width: '100%',
        textAlign: 'center',
        padding: 2,
        transition: 'background-color 0.3s ease',
        '&:hover': {
          backgroundColor: (theme) => theme.palette.primary.light,
        },
      }}
    >
      <CustomBox>
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

        <ImageBox image={image} />
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
            <Typography variant="body2" color="textSecondary">
              Added by <span style={{ fontStyle: 'italic' }}>{user}</span>
            </Typography>
          )
        )}
      </CustomBox>
    </Paper>
  );
};

export default Listing;
