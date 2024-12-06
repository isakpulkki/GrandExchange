import { Box, Typography } from '@mui/material';

export default function NotExist() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="h6" gutterBottom>
        Sorry, the page you're looking for doesn't exist.
      </Typography>
    </Box>
  );
}
