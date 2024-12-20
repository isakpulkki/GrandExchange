import { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import CustomBox from '../components/CustomBox';
import { useNavigate } from 'react-router-dom';
import Listings from '../components/Listings';
import { Listing } from '../types/listing'

interface UserData {
  listings: Listing[];
}

export default function Account() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || 'Failed to fetch the accounts data.'
          );
        }
        const data: UserData = await response.json();
        setUserData(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete the listing.');
      }

      setUserData((prevUserData) => {
        if (prevUserData) {
          return {
            ...prevUserData,
            listings: prevUserData.listings.filter(
              (listing) => listing.id !== id
            ),
          };
        }
        return prevUserData;
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  if (error) {
    return (
      <CustomBox>
        <Typography variant="h4" color="error" gutterBottom>
          {error}
        </Typography>
      </CustomBox>
    );
  }

  if (!userData) {
    return (
      <CustomBox>
        <Typography variant="h4" gutterBottom>
          Loading...
        </Typography>
      </CustomBox>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          textAlign: 'center',
          marginTop: 2
        }}
      >
        My Listings
      </Typography>
      <Listings listings={userData.listings} handleDelete={handleDelete} />
    </Container>
  );
}
