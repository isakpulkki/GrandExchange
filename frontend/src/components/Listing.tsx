import React from 'react';
import { Paper, Typography, IconButton, Box } from '@mui/material';
import { Delete } from '@mui/icons-material';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom';
import CustomBox from './CustomBox';
import ImageBox from './ImageBox';
import { Listing as ListingType } from '../types/listing';

const Listing: React.FC<ListingType> = ({
  title,
  description,
  price,
  id,
  user,
  image,
  visible,
  handleDelete,
  handleApprove,
}) => {
  const navigate = useNavigate();

  const handleClick = () => navigate(`/listings/${id}`);
  const handleDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleDelete?.(id);
  };
  const handleApproveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    handleApprove?.(id);
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
          sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
        >
          {title}
        </Typography>
        <ImageBox image={image} />
        <Typography
          gutterBottom
          sx={{ wordWrap: 'break-word', wordBreak: 'break-all' }}
        >
          {description.length > 100
            ? `${description.substring(0, 100)}...`
            : description}
        </Typography>
        <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
          {price} €
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            marginTop: 2,
          }}
        >
          {handleApprove && !visible && (
            <IconButton onClick={handleApproveClick} color="success">
              <DoneIcon />
            </IconButton>
          )}
          {handleDelete && (
            <IconButton onClick={handleDeleteClick} color="error">
              <Delete />
            </IconButton>
          )}
        </Box>
        {user && !handleDelete && (
          <Typography variant="body2" color="textSecondary">
            Added by <span style={{ fontStyle: 'italic' }}>{user}</span>
          </Typography>
        )}
      </CustomBox>
    </Paper>
  );
};

export default Listing;
