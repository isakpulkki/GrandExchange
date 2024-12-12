import { useEffect, useState } from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';

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
      <Typography variant="h4" gutterBottom>
        Listings
      </Typography>
      {listings.map(({ id, title, description, price, user }) => (
        <Paper
          key={id}
          sx={{
            padding: 2,
            marginBottom: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h5" gutterBottom>
              {title}
            </Typography>
            <Typography gutterBottom>{description}</Typography>
            <Typography variant="body2">
              Added by <span style={{ fontStyle: 'italic' }}>{user}</span>
            </Typography>
          </Box>
          <Typography variant="h6">{price} €</Typography>
        </Paper>
      ))}
    </Container>
  );
}
