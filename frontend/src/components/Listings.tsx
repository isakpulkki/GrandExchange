import React, { useEffect, useState } from 'react';
import { Grid2, Typography, Button } from '@mui/material';
import Listing from './Listing';
import { Listing as listingType } from '../types/listing';
import Filter from './Filter';
import Sort from './Sort';

interface ListingsProps {
  listings: listingType[];
  handleDelete?: (id: number) => void;
}

const Listings: React.FC<ListingsProps> = ({ listings, handleDelete }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [filteredListings, setFilteredListings] =
    useState<listingType[]>(listings);
  const [visibleListings, setVisibleListings] = useState<number>(3);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let updatedListings = listings;

    // Filter by category
    if (selectedCategory !== 'All') {
      updatedListings = listings.filter(
        (listing) => listing.category === selectedCategory
      );
    }

    switch (sortOption) {
      case 'newest':
        updatedListings = [...updatedListings].reverse();
        break;
      case 'oldest':
        updatedListings = [...updatedListings];
        break;
      case 'lowToHigh':
        updatedListings = [...updatedListings].sort(
          (a, b) => a.price - b.price
        );
        break;
      case 'highToLow':
        updatedListings = [...updatedListings].sort(
          (a, b) => b.price - a.price
        );
        break;
      default:
        break;
    }

    setFilteredListings(updatedListings);
    setVisibleListings(Math.min(3, updatedListings.length));
  }, [selectedCategory, listings, sortOption]);

  const handleShowMore = () => {
    setVisibleListings((prev) => {
      const newVisibleListings = prev + 3;
      return newVisibleListings > filteredListings.length
        ? filteredListings.length
        : newVisibleListings;
    });
  };

  return (
    <div>
      {/* Show the filter component if this is not the 'My Account' page. */}

      {!handleDelete && (
        <Filter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      )}

      {/* Sorting Component */}
      {!handleDelete && <Sort value={sortOption} onChange={setSortOption} />}
      <Grid2
        container
        spacing={2}
        justifyContent="center"
        sx={{ marginTop: 2 }}
      >
        {filteredListings.length > 0 ? (
          filteredListings
            .slice(0, visibleListings)
            .map(({ id, title, description, price, image, user }, index) => (
              <Grid2
                key={id}
                size={{
                  xs: 12,
                  md: visibleListings % 2 === 1 && index === 0 ? 12 : 6,
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
            ))
        ) : (
          <Typography color="textSecondary">No added listings yet.</Typography>
        )}
      </Grid2>

      {/* Show "Show more" button if there are more listings to show. */}
      {filteredListings.length > visibleListings && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleShowMore}
          sx={{ margin: 5 }}
        >
          Show More...
        </Button>
      )}
    </div>
  );
};

export default Listings;
