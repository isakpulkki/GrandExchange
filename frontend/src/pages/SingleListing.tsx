import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@mui/material';
import CustomBox from '../components/CustomBox';
import ImageBox from '../components/ImageBox';
import { Listing } from '../types/listing';

const SingleListing = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);
        if (!response.ok) throw new Error('Listing not found.');
        const data: Listing = await response.json();
        setListing(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred.'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading)
    return (
      <CustomBox>
        <Typography variant="h6">Loading...</Typography>
      </CustomBox>
    );
  if (error)
    return (
      <CustomBox>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
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
      <Typography variant="body2" sx={{ textAlign: 'center' }}>
        Added by <span style={{ fontStyle: 'italic' }}>{listing.user}</span>
      </Typography>
    </CustomBox>
  );
};

export default SingleListing;
