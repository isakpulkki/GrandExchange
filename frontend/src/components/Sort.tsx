import React from 'react';
import { Select, MenuItem, InputLabel, FormControl } from '@mui/material';

interface SortProps {
  value: string; // Current selected value
  onChange: (value: string) => void; // Function to handle change
}

const Sort: React.FC<SortProps> = ({ value, onChange }) => {
  return (
    <FormControl sx={{ margin: 1, width: '160px' }}>
      <InputLabel id="sort-label">Sort By</InputLabel>
      <Select
        labelId="sort-label"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Sort By" // Ensure the label works properly
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
