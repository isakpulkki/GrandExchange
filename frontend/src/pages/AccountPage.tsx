import { useEffect, useState } from 'react';
import { Typography, Button, TextField, Box } from '@mui/material';
import CustomBox from '../components/CustomBox';
import { useNavigate } from 'react-router-dom';
import Listings from '../components/Listings';
import { Listing } from '../types/listing';
import { handleDelete } from '../utils/handleDelete';
import useUserData from '../hooks/useUserData';

export default function Account() {
  const userData = useUserData();
  const [listings, setListings] = useState<Listing[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showChangePassword, setShowChangePassword] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: passwords.newPassword }),
    });
    if (!response.ok) throw new Error(await response.text());
    setPasswords({ newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
    setMessage('Password changed successfully.');
  };

  useEffect(() => {
    if (userData) {
      setListings(userData.listings);
    }
  }, [userData]);

  return (
    <CustomBox>
      <Box sx={{ alignItems: 'center' }}>
        {userData && (
          <Typography variant="h4">Hi, {userData.username}!</Typography>
        )}

        {message && (
          <Typography
            color={
              message.toLowerCase().includes('success') ? 'green' : 'error'
            }
          >
            {message}
          </Typography>
        )}

        <Button
          variant="outlined"
          onClick={() => setShowChangePassword((prev) => !prev)}
          sx={{ marginTop: 2 }}
        >
          {showChangePassword ? 'Cancel' : 'Change Password'}
        </Button>

        {userData?.admin && (
          <Button
            variant="contained"
            onClick={() => navigate('/approvelistings')}
            sx={{ marginTop: 2, marginLeft: 2 }}
          >
            Approve Listings
          </Button>
        )}
      </Box>

      {showChangePassword && (
        <div style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords((prev) => ({ ...prev, newPassword: e.target.value }))
            }
            margin="normal"
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            error={passwords.newPassword !== passwords.confirmPassword}
            helperText={
              passwords.newPassword !== passwords.confirmPassword
                ? 'Passwords do not match'
                : ''
            }
            margin="normal"
          />
          <Button
            fullWidth
            variant="contained"
            onClick={handleChangePassword}
            disabled={
              !passwords.newPassword ||
              passwords.newPassword !== passwords.confirmPassword
            }
            sx={{ marginTop: 2 }}
          >
            Change
          </Button>
        </div>
      )}

      <Typography variant="h5" sx={{ marginTop: 2 }}>
        My Listings
      </Typography>
      <Listings
        listings={listings}
        handleDelete={(id: number) => handleDelete(id, token, setListings)}
      />
    </CustomBox>
  );
}
