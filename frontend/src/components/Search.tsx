import React from 'react';
import { TextField } from '@mui/material';
import CustomBox from './CustomBox';

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <CustomBox>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </CustomBox>
  );
};

export default Search;
