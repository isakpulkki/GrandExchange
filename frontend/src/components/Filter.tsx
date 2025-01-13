import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CustomBox from './CustomBox';

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
    <CustomBox
    >
      <FormControl required={newListing} sx={{ width: '250px' }}>
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
    </CustomBox>
  );
};

export default Filter;
