import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { SortProps } from '../types/sort';

const Sort: React.FC<SortProps> = ({ value, onChange }) => {
  return (
    <FormControl>
      <InputLabel id="sort-label">Sort By</InputLabel>
      <Select
        labelId="sort-label"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Sort By"
      >
        <MenuItem value="newest">First Added</MenuItem>
        <MenuItem value="oldest">Last Added</MenuItem>
        <MenuItem value="lowToHigh">Lowest Price</MenuItem>
        <MenuItem value="highToLow">Highest Price</MenuItem>
      </Select>
    </FormControl>
  );
};

export default Sort;
