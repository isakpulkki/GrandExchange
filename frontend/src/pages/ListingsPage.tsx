import { Typography } from '@mui/material';
import Listings from '../components/Listings';
import CustomBox from '../components/CustomBox';
import { handleDelete } from '../utils/handleDelete';
import useListings from '../hooks/useListings';
import useUserData from '../hooks/useUserData';

export default function ListingsPage() {
  const { listings, setListings } = useListings(true);
  const user = useUserData();

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