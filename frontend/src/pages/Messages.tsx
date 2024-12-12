import { Typography } from '@mui/material';
import CustomBox from '../components/CustomBox';

export default function Messages() {
  return (
    <CustomBox
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h6" gutterBottom>
        This feature is coming soon!
      </Typography>
    </CustomBox>
  );
}
