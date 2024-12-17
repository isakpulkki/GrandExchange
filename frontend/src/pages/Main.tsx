import { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import Listings from '../components/Listings'; // Import the ListingGrid component

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  user: string;
}

export default function MainPage() {
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
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
        }}
      >
        Listings
      </Typography>
      <Listings listings={listings} />
    </Container>
  );
}
