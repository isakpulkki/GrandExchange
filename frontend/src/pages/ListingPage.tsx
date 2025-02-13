import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Link } from '@mui/material';
import CustomBox from '../components/CustomBox';
import ImageBox from '../components/ImageBox';
import { Listing as ListingType } from '../types/listing';
import SendMessage from '../components/SendMessage';

const Listing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<ListingType | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListing = async () => {
      const headers: HeadersInit = token
        ? { Authorization: `Bearer ${token}` }
        : {};
      const response = await fetch(`/api/listings/${id}`, { headers });

      if (response.ok) {
        const data: ListingType = await response.json();
        setListing(data);
      }
      setLoading(false);
    };
    fetchListing();
  }, [id, token]);

  if (loading) {
    return (
      <CustomBox>
        <Typography variant="h6">Loading...</Typography>
      </CustomBox>
    );
  }

  if (!listing) {
    return (
      <CustomBox>
        <Typography variant="h6">Listing not found.</Typography>
      </CustomBox>
    );
  }

  return (
    <CustomBox>
      <Typography variant="h4" gutterBottom sx={{ wordWrap: 'break-word' }}>
        {listing.title}
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: 'center', marginBottom: 2 }}
      >
        <span style={{ fontStyle: 'italic' }}>{listing.category}</span>
      </Typography>
      <ImageBox image={listing.image} fullSize={true} />
      <Typography gutterBottom sx={{ wordWrap: 'break-word' }}>
        {listing.description}
      </Typography>
      <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
        {listing.price} €
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: 'center', marginBottom: 2 }}
      >
        Added by <span style={{ fontStyle: 'italic' }}>{listing.user}</span>
      </Typography>
      {token ? (
        <SendMessage receiver={listing.user} token={token} />
      ) : (
        <Typography variant="body1" color="textSecondary">
          <span style={{ fontStyle: 'italic' }}>
            <Link href="/login" color="primary">
              Login
            </Link>{' '}
            or{' '}
            <Link href="/register" color="primary">
              register
            </Link>{' '}
            to send a message to the seller!
          </span>
        </Typography>
      )}
    </CustomBox>
  );
};

export default Listing;
