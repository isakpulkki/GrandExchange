import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface FilterProps {
  categories: { id: number; name: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  newListing?: boolean;
}

const Filter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  newListing = false,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 2,
      }}
    >
      <FormControl required={newListing} sx={{ width: '35vh' }}>
        <InputLabel>Select a Category</InputLabel>
        <Select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          {/* Don't show the 'All' -option if adding a new listing. */}
          {!newListing && (
            <MenuItem
              value="All"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                width: '35vh',
              }}
            >
              All
            </MenuItem>
          )}
          {categories.map((category) => (
            <MenuItem
              key={category.id}
              value={category.name}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filter;
