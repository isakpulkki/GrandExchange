import { Box, Typography } from '@mui/material';

export default function Messages() {
  return (
    <Box
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
    </Box>
  );
}
