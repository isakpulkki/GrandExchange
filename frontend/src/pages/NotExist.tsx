import { Typography } from '@mui/material';
import CustomBox from '../components/CustomBox';

export default function NotExist() {
  return (
    <CustomBox
    >
      <Typography variant="h3" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="h6" gutterBottom>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
    </CustomBox>
  );
}
