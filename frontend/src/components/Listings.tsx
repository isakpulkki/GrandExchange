import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import Listing from './Listing';
import { Listing as ListingType } from '../types/listing';
import { ListingsProps } from '../types/listings';
import Filter from './Filter';
import Sort from './Sort';
import Search from './Search';

const Listings: React.FC<ListingsProps> = ({
  listings,
  handleDelete,
  handleApprove,
  admin,
}) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredListings, setFilteredListings] =
    useState<ListingType[]>(listings);
  const [visibleListings, setVisibleListings] = useState<number>(4);

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

    if (selectedCategory !== 'All') {
      updatedListings = updatedListings.filter(
        (listing) => listing.category === selectedCategory
      );
    }

    if (searchTerm) {
      updatedListings = updatedListings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    setVisibleListings(Math.min(4, updatedListings.length));
  }, [selectedCategory, listings, sortOption, searchTerm]);

  const handleShowMore = () => {
    setVisibleListings((prev) => Math.min(prev + 4, filteredListings.length));
  };

  const shouldShowTools = (handleDelete && admin) || (!handleDelete && !admin);

  return (
    <div>
      {shouldShowTools && (
        <>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Filter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <Sort value={sortOption} onChange={setSortOption} />
          </Box>
          <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </>
      )}

      {filteredListings.length > 0 ? (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginTop: 0 }}
        >
          {filteredListings
            .slice(0, visibleListings)
            .map(({ id, title, description, price, image, user }, index) => (
              <Grid
                key={id}
                item
                xs={12}
                sm={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  ...(visibleListings % 2 === 1 &&
                    index === visibleListings - 1 && { width: '50%' }),
                }}
              >
                <Listing
                  title={title}
                  description={description}
                  price={price}
                  id={id}
                  handleDelete={handleDelete}
                  handleApprove={handleApprove}
                  user={user}
                  image={image}
                />
              </Grid>
            ))}
        </Grid>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <Typography color="textSecondary">No added listings yet.</Typography>
        </Box>
      )}

      {filteredListings.length > visibleListings && (
        <Button
          variant="outlined"
          color="primary"
          onClick={handleShowMore}
          sx={{ margin: 2 }}
        >
          Show More...
        </Button>
      )}
    </div>
  );
};

export default Listings;
