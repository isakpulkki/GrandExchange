import React from 'react';
import { Grid2, Typography } from '@mui/material';
import Listing from './Listing';
import { Listing as listingType } from '../types/listing';

interface ListingsProps {
  listings: listingType[];
  handleDelete?: (id: number) => void;
}

const Listings: React.FC<ListingsProps> = ({ listings, handleDelete }) => {
  return (
    <Grid2 container spacing={2} justifyContent="center" marginTop={2}>
      {listings.length > 0 ? (
        listings.map(({ id, title, description, price, user }, index) => (
          <Grid2
            size={{
              xs: 12,
              md: listings.length % 2 === 1 && index === 0 ? 12 : 6,
            }}
          >
            <Listing
              title={title}
              description={description}
              price={price}
              id={id}
              handleDelete={handleDelete}
              user={user}
            />
          </Grid2>
        ))
      ) : (
        <Typography variant="h6">No added listings yet.</Typography>
      )}
    </Grid2>
  );
};

export default Listings;
