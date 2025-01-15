import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Listings from '../components/Listings';
import { Listing } from '../types/listing';
import CustomBox from '../components/CustomBox';

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const baseUrl = '/api/listings';

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch listings.');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings: ', error);
      }
    };

    fetchListings();
  }, [baseUrl]);

  return (
    <CustomBox>
      <Typography variant="h4" gutterBottom>Listings</Typography>
      <Listings listings={listings} />
    </CustomBox>
  );
}
