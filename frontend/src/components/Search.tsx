import React from 'react';
import { TextField, Box } from '@mui/material';

interface SearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const Search: React.FC<SearchProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <Box sx={{ marginTop: 2, marginBottom: 2 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search listings..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </Box>
  );
};

export default Search;