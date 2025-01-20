import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Listings from '../components/Listings';
import { Listing } from '../types/listing';
import CustomBox from '../components/CustomBox';
import { handleDelete } from '../utils/handleDelete';

export default function ApproveListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const baseUrl = '/api/listings';
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch(baseUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        if (!response.ok) throw new Error('Failed to fetch listings.');
        const data = await response.json();
        const hiddenListings = data.filter(
          (listing: Listing) => !listing.visible
        );
        setListings(hiddenListings);
      } catch (error) {
        console.error('Error fetching listings: ', error);
      }
    };
    fetchListings();
  }, [baseUrl, token]);

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visible: true }),
      });
      if (!response.ok) throw new Error(await response.text());
      setListings((prevListings) =>
        prevListings.filter((listing) => listing.id !== id)
      );
    } catch (error) {
      console.error('Error approving listing: ', error);
    }
  };

  return (
    <CustomBox>
      <Typography variant="h4" gutterBottom>
        Approve Listings
      </Typography>
      <Listings
        listings={listings}
        handleDelete={(id: number) => handleDelete(id, token, setListings)}
        handleApprove={handleApprove}
      />
    </CustomBox>
  );
}
