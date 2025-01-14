import { Typography } from '@mui/material';

interface TimestampProps {
  timestamp: string;
}

const Timestamp: React.FC<TimestampProps> = ({ timestamp }) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return (
    <Typography variant="caption" color="textSecondary">
      {`${day}.${month}.${year} at ${hours}:${minutes}`}
    </Typography>
  );
};

export default Timestamp;
