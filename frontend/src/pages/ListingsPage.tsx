import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import Listings from '../components/Listings';
import { Listing } from '../types/listing';
import CustomBox from '../components/CustomBox';
import { handleDelete } from '../utils/handleDelete';

interface UserData {
  admin?: boolean;
}

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const baseUrl = '/api/listings';

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userResponse = await fetch('/api/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            console.error('Failed to fetch user data.');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    const fetchListings = async () => {
      try {
        const response = await fetch(baseUrl);
        if (!response.ok) throw new Error('Failed to fetch listings.');
        const data = await response.json();
        const visibleListings = data.filter(
          (listing: Listing) => listing.visible === true
        );
        setListings(visibleListings);
      } catch (error) {
        console.error('Error fetching listings: ', error);
      }
    };
    fetchUserData();
    fetchListings();
  }, [baseUrl]);

  return (
    <CustomBox>
      <Typography variant="h4" gutterBottom>
        Listings
      </Typography>
      <Listings
        listings={listings}
        handleDelete={
          user?.admin
            ? (id: number) =>
                handleDelete(id, localStorage.getItem('token'), setListings)
            : undefined
        } 
        admin={user?.admin}
      />
    </CustomBox>
  );
}
