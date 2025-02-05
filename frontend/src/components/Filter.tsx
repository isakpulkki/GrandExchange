import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

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
    <FormControl required={newListing} sx={{ minWidth: 130 }}>
      <InputLabel id="category-label">Select a Category</InputLabel>
      <Select
        labelId="category-label"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        label="Select a Category"
      >
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
  );
};

export default Filter;
