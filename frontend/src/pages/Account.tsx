import { useEffect, useState } from 'react';
import { Typography, Button, TextField } from '@mui/material';
import CustomBox from '../components/CustomBox';
import { useNavigate } from 'react-router-dom';
import Listings from '../components/Listings';
import { Listing } from '../types/listing';

interface UserData {
  username: string;
  listings: Listing[];
}

export default function Account() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');
    try {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch the user data.');
      }
      setUserData(await response.json());
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({
          text: 'An unexpected error occurred.',
          type: 'error',
        });
      }
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete the listing.');
      }
      setUserData((prev) => ({
        ...prev!,
        listings: prev!.listings.filter((listing) => listing.id !== id),
      }));
      setMessage({ text: 'Listing deleted successfully.', type: 'success' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({
          text: 'An unexpected error occurred.',
          type: 'error',
        });
      }
    }
  };

  const handleChangePassword = async () => {
    const { newPassword } = passwords;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to change the password.');
      }
      setPasswords({ newPassword: '', confirmPassword: '' });
      setShowChangePassword(false);
      setMessage({ text: 'Password changed successfully.', type: 'success' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage({ text: error.message, type: 'error' });
      } else {
        setMessage({
          text: 'An unexpected error occurred.',
          type: 'error',
        });
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <CustomBox>
      <Typography variant="h4">Hi, {userData?.username}!</Typography>
      <Button
        variant="outlined"
        onClick={() => setShowChangePassword((prev) => !prev)}
        sx={{ margin: 2 }}
      >
        {showChangePassword ? 'Cancel' : 'Change Password'}
      </Button>

      {message && (
        <Typography
          sx={{ color: message.type === 'success' ? 'green' : 'red' }}
        >
          {message.text}
        </Typography>
      )}

      {showChangePassword && (
        <CustomBox>
          <TextField
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
            error={passwords.newPassword !== passwords.confirmPassword}
            helperText={
              passwords.newPassword !== passwords.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            onClick={handleChangePassword}
            disabled={
              !passwords.newPassword ||
              passwords.newPassword !== passwords.confirmPassword
            }
          >
            Change
          </Button>
        </CustomBox>
      )}

      <Typography variant="h5" sx={{ marginTop: 2 }}>
        My Listings
      </Typography>
      <Listings
        listings={userData?.listings || []}
        handleDelete={handleDelete}
      />
    </CustomBox>
  );
}
