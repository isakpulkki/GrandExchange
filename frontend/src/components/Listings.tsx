import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import Listing from './Listing';
import { Listing as listingType } from '../types/listing';
import Filter from './Filter';
import Sort from './Sort';
import Search from './Search';

interface ListingsProps {
  listings: listingType[];
  handleDelete?: (id: number) => void;
  handleApprove?: (id: number) => void;
  admin?: boolean;
}

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
    useState<listingType[]>(listings);
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
    setVisibleListings((prev) => {
      const newVisibleListings = prev + 4;
      return newVisibleListings > filteredListings.length
        ? filteredListings.length
        : newVisibleListings;
    });
  };

  const shouldShowFilterAndSort =
    (handleDelete && admin) || (!handleDelete && !admin);

  return (
    <div>
      {shouldShowFilterAndSort && (
        <>
          <Filter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <Sort value={sortOption} onChange={setSortOption} />
          <Search searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </>
      )}

      <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 0 }}>
        {filteredListings.length > 0 ? (
          filteredListings
            .slice(0, visibleListings)
            .map(({ id, title, description, price, image, user }, index) => (
              <Grid
                key={id}
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  ...(visibleListings % 2 === 1 &&
                    index === visibleListings - 1 && {
                      md: 6,
                      width: '50%',
                    }),
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
            ))
        ) : (
          <Typography color="textSecondary">No added listings yet.</Typography>
        )}
      </Grid>

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
