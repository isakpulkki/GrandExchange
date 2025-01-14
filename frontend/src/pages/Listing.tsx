import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
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
      const response = await fetch(`/api/listings/${id}`);
      if (response.ok) {
        const data: ListingType = await response.json();
        setListing(data);
      }
      setLoading(false);
    };
    fetchListing();
  }, [id]);

  if (loading)
    return (
      <CustomBox>
        <Typography variant="h6">Loading...</Typography>
      </CustomBox>
    );
  if (!listing)
    return (
      <CustomBox>
        <Typography variant="h6">Listing not found.</Typography>
      </CustomBox>
    );

  return (
    <CustomBox>
      <Typography variant="h4" gutterBottom sx={{ wordWrap: 'break-word' }}>
        {listing.title}
      </Typography>
      <ImageBox image={listing.image} />
      <Typography gutterBottom sx={{ wordWrap: 'break-word' }}>
        {listing.description}
      </Typography>
      <Typography gutterBottom variant="h6" sx={{ fontWeight: 'bold' }}>
        {listing.price} €
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        sx={{ textAlign: 'center' }}
      >
        Added by <span style={{ fontStyle: 'italic' }}>{listing.user}</span>
      </Typography>

      {listing.user && <SendMessage listingUser={listing.user} token={token} />}
    </CustomBox>
  );
};

export default Listing;
