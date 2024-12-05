import { useEffect, useState } from 'react';
import { Typography, Container, Paper } from '@mui/material';

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
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
      <Typography variant="h4" gutterBottom>
        Listings
      </Typography>
      {listings.map(({ id, title, description, price }) => (
        <Paper
          key={id}
          sx={{
            padding: 2,
            marginBottom: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <Typography variant="h5">{title}</Typography>
            <Typography>{description}</Typography>
          </div>
          <Typography variant="h6">{price} €</Typography>
        </Paper>
      ))}
    </Container>
  );
}
