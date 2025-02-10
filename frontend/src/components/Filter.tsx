import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import type { FilterProps } from '../types/filter';

const Filter: React.FC<FilterProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
  newListing = false,
}) => (
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
          sx={{ display: 'flex', justifyContent: 'center', width: '35vh' }}
        >
          All
        </MenuItem>
      )}
      {categories.map((category) => (
        <MenuItem
          key={category.id}
          value={category.name}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          {category.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default Filter;
