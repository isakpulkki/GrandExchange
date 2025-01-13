import React, { useEffect, useState } from 'react';
import { Grid2, Typography } from '@mui/material';
import Listing from './Listing';
import { Listing as listingType } from '../types/listing';
import Filter from './Filter';

interface ListingsProps {
  listings: listingType[];
  handleDelete?: (id: number) => void;
}
const Listings: React.FC<ListingsProps> = ({ listings, handleDelete }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [filteredListings, setFilteredListings] =
    useState<listingType[]>(listings);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredListings(listings);
    } else {
      setFilteredListings(
        listings.filter((listing) => listing.category === selectedCategory)
      );
    }
  }, [selectedCategory, listings]);

  return (
    <div>
      {/* Show the filter component if this is not the 'My Account' -page. */}
      {!handleDelete && (
        <Filter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}
      <Grid2 container spacing={2} justifyContent="center" sx={{marginTop: 2}}>
        {filteredListings.length > 0 ? (
          filteredListings.map(
            ({ id, title, description, price, image, user }, index) => (
              <Grid2
                key={id}
                size={{
                  xs: 12,
                  md: filteredListings.length % 2 === 1 && index === 0 ? 12 : 6,
                }}
              >
                <Listing
                  title={title}
                  description={description}
                  price={price}
                  id={id}
                  handleDelete={handleDelete}
                  user={user}
                  image={image}
                />
              </Grid2>
            )
          )
        ) : (
          <Typography variant="h6">No added listings yet.</Typography>
        )}
      </Grid2>
    </div>
  );
};

export default Listings;
