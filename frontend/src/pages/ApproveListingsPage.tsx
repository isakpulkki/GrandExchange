import { Typography } from '@mui/material';
import Listings from '../components/Listings';
import CustomBox from '../components/CustomBox';
import { handleDelete } from '../utils/handleDelete';
import useListings from '../hooks/useListings';

export default function ApproveListingsPage() {
  const { listings, setListings } = useListings(false);
  const token = localStorage.getItem('token');

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
      setListings((prevListings) => prevListings.filter((listing) => listing.id !== id));
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